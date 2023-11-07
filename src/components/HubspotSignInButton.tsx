import { FC, ReactNode } from 'react';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';

interface HubspotSignInButtonProps {
  children: ReactNode;
}
const HubspotSignInButton: FC<HubspotSignInButtonProps> = ({ children }) => {
  const loginWithHubspot = () => 
    signIn('hubspot');

    // , { callbackUrl: 'http://localhost:3000/api/auth/callback/hubspot' }

    // console.log(loginWithHubspot)

  return (
    <Button onClick={loginWithHubspot} className='w-full'>
      {children}
    </Button>
  );
};

export default HubspotSignInButton;