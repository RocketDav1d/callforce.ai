import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React, { useState } from 'react'
import  Sidebar, { SidebarItem } from '@/components/Sidebar';
import RootLayout from '../../layout'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from 'axios';
import prisma from '@/lib/db';
import qs from 'qs';
import MultiSelect from '@/components/UseMultiSelectSearch';
import { revalidatePath } from 'next/cache'
import { error } from 'console';
import Subscriptions from '@/components/Subscriptions';
// import { toast } from "@/components/ui/use-toast"
import { toast } from 'react-hot-toast'




type AccountType = {
    id: string;
    access_token: string | null;
    refresh_token: string | null;
    expires_at: number | null;
    providerAccountId: string;
  };


type AccessToken = {
    access_token: string | null;
};

type PropertyItem = {
    name: string;
    description: string;
    label: string;
    hidden: boolean;
    archived: string;  // assuming this is a string; modify if it's a different type
    object_type: string;
  };
  
type PropertiesResponse = {
    contacts?: PropertyItem[];
    companies?: PropertyItem[];
    deals?: PropertyItem[];
  }[];
  
// type SelectOptions = {
//     label: string;
//     value: string;
//   };


type SelectOptions = {
label: string;
value: {
    name: string;
    label: string;
    description: string;
};
};
  
type ProcessedProperties = {
    contacts: SelectOptions[];
    companies: SelectOptions[];
    deals: SelectOptions[];
  };



  
const getUserID = async () => {
  
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("User is not authenticated");
        }
    const userEmail = session.user.email;
    if (!userEmail) {
        throw new Error("User email is not defined");
        }
    try {
      // Retrieve the user ID based on their email
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });
      const userId = user!.id;
      return userId;

    } catch (error) {
        console.error("Error in getUserID:", error);
        throw error;
    }
}

const getUserSubscription = async (userId: string) => {
  const subscription = await prisma.userSubscription.findUnique({
    where: { userId: userId }
  });
  console.log("Subscription inside getUserSubscription:", subscription) 
  return subscription !== null;
};

console.log("HAAAALLLLOOOOOOOO", "haus")

const getAccount = async (userId: string) => {
    try {

        let account: AccountType | null = await prisma.account.findFirst({
            where: {
              userId: userId,
              provider: 'hubspot',
            },
            select: {
              id: true,
              access_token: true,
              refresh_token: true,
              expires_at: true,
              providerAccountId: true,
            }
          });

        if (!account) {
            console.log("🚩 Account not found");
            throw new Error("Account not found");
        }
        console.log("Account inside getAccount:", account)

        const currentTime = Math.floor(Date.now() / 1000);
        if (account.expires_at && account.expires_at < currentTime) 
        {
            console.log("Access token is expired. Refreshing token...");
    
            const response = await axios.post('https://api.hubapi.com/oauth/v1/token', qs.stringify({
            grant_type: 'refresh_token',
            client_id: process.env.HUBSPOT_CLIENT_ID,
            client_secret: process.env.HUBSPOT_CLIENT_SECRET,
            redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
            refresh_token: account.refresh_token,
            }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            });
            console.log("Response from Hubspot:", response.status);
            console.log("Response from Hubspot:", response.data);
    
            const newTokenData = response.data;
            console.log("New Token Data inside Tokens Route: ", newTokenData);
    
            account = await prisma.account.update({
            where: {
                id: account.id, 
            },
            data: {
                access_token: newTokenData.access_token,
                expires_at: currentTime + newTokenData.expires_in,
                refresh_token: newTokenData.refresh_token || account.refresh_token,
            },
            select: {
                id: true,
                access_token: true,
                refresh_token: true,
                expires_at: true,
                providerAccountId: true,
            }
            });
            if (!account) {
              throw new Error("Account not found");
            }
            console.log("Account inside getAccount after refresh:", account)
        }
        return account;
    }
    catch (error) {
        console.error("Error in getAccount:", error);
        throw error;
    }
}



const getProperties = async (token: AccessToken)=> {
    console.log("Token inside getProperties:", token.access_token)
    try {
    const response = await fetch('https://callforce-worker-07ee47d87df1.herokuapp.com/properties', {
    // const response = await fetch('http://127.0.0.1:8000/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({access_token: token.access_token}),
      })

    const data = await response.json();
    console.log("Data", data);
    return data;
  
    } catch (error) {
        console.error("Error in getProperties:", error);
        throw error;
        }
    
  };


const processProperties = (properties: PropertiesResponse): ProcessedProperties => {
    const options: ProcessedProperties = {
      contacts: [],
      companies: [],
      deals: [],
    };

    properties.forEach(property => {
        if (property.contacts) {
          options.contacts = property.contacts.map(item => ({
            label: item.label,
            value: {
              name: item.name,
              label: item.label,
              description: item.description,
            },
          }));
        } 
        else if (property.companies) {
          options.companies = property.companies.map(item => ({
                label: item.label,
                value: {
                name: item.name,
                label: item.label,
                description: item.description,
                },
          }));
        } 
        else if (property.deals) {
          options.deals = property.deals.map(item => ({
                    label: item.label,
                    value: {
                    name: item.name,
                    label: item.label,
                    description: item.description,
                    },
          }));
        }
    });
  
    return options;
  };





const page = async () => { 

    const userId = await getUserID();
    console.log("User ID", userId)
    const account = await getAccount(userId);
    console.log("Account", account)

    type SelectOptions = {
        label: string;
        value: string;
      };
      
    // type ProcessedProperties = {
    // contacts: SelectOptions[];
    // companies: SelectOptions[];
    // deals: SelectOptions[];
    // };

    let selectOptions: ProcessedProperties = {
        contacts: [],
        companies: [],
        deals: []
    };

    if (account.access_token) {
        const access_token: AccessToken = { access_token: account.access_token };
        const properties = await getProperties(access_token);
        selectOptions = processProperties(properties);
    } else {
        console.error("Access token is null")
    }

    async function createProperties(formData: FormData) {
        "use server"
        const contactsData = formData.getAll('contacts').map(contact => {
            if (typeof contact === 'string') {
              return JSON.parse(contact);
            }
            throw new Error('Expected string in form data');
          });
        const companiesData = formData.getAll('companies').map(company => {
            if (typeof company === 'string') {
              return JSON.parse(company);
            }
            throw new Error('Expected string in form data');
          });
        const dealsData = formData.getAll('deals').map(deals => {
            if (typeof deals === 'string') {
              return JSON.parse(deals);
            }
            throw new Error('Expected string in form data');
          });
        // const companiesData = formData.getAll('companies').map(company => JSON.parse(company));   
        console.log("Contacts Data", contactsData)
        console.log("Companies Data", companiesData)
        console.log("Deals Data", dealsData)

        // get UserId
        const userId = await getUserID();

        try {
            const contactProperties = contactsData.map(contact => ({
                ...contact,
                type: 'CONTACT',
                userId,
              }));
    
            const companyProperties = companiesData.map(company => ({
            ...company,
            type: 'COMPANY',
            userId,
            }));
            
            const dealProperties = dealsData.map(deal => ({
            ...deal,
            type: 'DEAL',
            userId,
            }));
    
            const allProperties = [...contactProperties, ...companyProperties, ...dealProperties];
    
            const properties = await prisma.hubSpotProperty.createMany({
              data: allProperties,
            });

            return properties;
        } catch (error) {
            console.error("Error in creating property instaces for prisma:", error);
            throw error;
        }
        revalidatePath('/settings')
    }


    const hasSubscription = await getUserSubscription(userId);
    console.log("Has Subscription", hasSubscription)

    const session = await getServerSession(authOptions);
    if(session?.user) {
        return (
            <RootLayout>
                <div className='flex flex-row w-screen h-screen'> {/* Flex container for sidebar and grid */}
                  <Sidebar> {/* Sidebar remains flex item, not affected by grid */}
                    <SidebarItem icon={undefined} text={'Calls'} href="/admin"></SidebarItem>
                    <SidebarItem icon={undefined} text={'Analystics'} href="/analytics"></SidebarItem>
                    <SidebarItem icon={undefined} text={'Settings'} href="/settings"></SidebarItem>
                  </Sidebar>

                    <div className="w-screen grid grid-cols-5 grid-rows-5 m-10 gap-y-52">
                      <div className="div1 col-start-1 row-start-1 col-span-1 row-span-1">
                          <form action={createProperties}>
                          <Card className="w-[350px]">
                            <CardHeader>
                                <CardTitle>Set up Hubspot</CardTitle>
                                <CardDescription>Select the Properties you want the AI to search for</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid w-full items-center gap-4">

                                    <div className="flex flex-col space-y-1.5">
                                    <div>
                                        <Label>Select Contacts Properties</Label>
                                        <MultiSelect name="contacts" options={selectOptions.contacts} />
                                    </div>
                                    <div>
                                        <Label>Select Company Properties</Label>
                                        <MultiSelect name="companies" options={selectOptions.companies} />
                                    </div>
                                    <div>
                                        <Label>Select Deal Properties</Label>
                                        <MultiSelect name="deals" options={selectOptions.deals} />
                                    </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button type='submit'>Save Settings</Button>
                            </CardFooter>
                          </Card>
                        </form>
                      </div>

                      <div className="div3 col-start-3 row-start-1 col-span-1 row-span-1">
                        <Card className='w-[350px] h-[400px]'>
                          <CardHeader>
                            <CardTitle>Manage Subscription</CardTitle>
                            <CardContent>
                              <Subscriptions hasSubscription={hasSubscription}/>
                            </CardContent>
                          </CardHeader>
                        </Card>
                      </div>
                    
                    </div>
                </div>
            </RootLayout>
        )
    }

    return ( <h1> Please login to see this page </h1>)

 }

export default page



















// type TokenResponse = {
//     account: {
//       id: string;
//       access_token: string;
//       refresh_token: string;
//       expires_at: number;
//       providerAccountId: string;
//     };
// };

// type ErrorResponse = {
// message: string;
// };
  
// type TokenApiResponse = TokenResponse | ErrorResponse;


// const getTokens = async (): Promise<TokenApiResponse> => {
//     try {
//       const response = await axios.get<TokenApiResponse>(`http://localhost:3000/api/tokens`, { withCredentials: true });
//       return response.data;
//     } catch (error) {
//       console.error("Error in getTokens:", error);
//       throw error;
//     }
//   };



// const getProperties = async (token: TokenApiResponse): Promise<any>=> {
//     try {
//     const response = await axios.post(`/api/properties`, { token }, { withCredentials: true });
//       return response.data;
//     } catch (error) {
//       console.error("Error in getProperties:", error);
//       throw error;
//     }
//   };