'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

type Group = {
  name: string;
  // Include other properties of a group here
};

const GroupManager = () => {
  // const [groups, setGroups] = useState<string[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    // Load groups from the database when the component mounts
    const loadGroups = async () => {
      // const res = await fetch('/api/groups/get');
      const res = await axios.get(`/api/groups/get`, { withCredentials: true });
      console.log("Inside GroupManager", res.data);
      setGroups(res.data.groups);
    };

    loadGroups();
  }, []);



  const handleAddGroup = async () => {
    if (newGroupName) {
      console.log("Inside handleAddGroup", newGroupName);
      // Save the new group to the database
      const response = await axios.post(`/api/groups/create`, { name: JSON.stringify(newGroupName)}, 
      {
        headers: {
            'Content-Type': 'application/json'
          }
      }
      
      );

      // const res = await fetch('/api/groups/create', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ name: newGroupName }),
      // });
      
      // const data = await res.data();
      console.log(response.data);

      // Update the local state
      setGroups([...groups, response.data]);
      setNewGroupName('');
    }
  };

  return (
    <div style={{ width: '100%', height: '25vh', overflowY: 'scroll' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Calls</h1>
        <div>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Group name"
          />
          <button onClick={handleAddGroup}>Add Group</button>
        </div>
      </div>
      {groups.map((group, index) => (
        <div key={index} style={{ border: '1px solid black', margin: '10px 0', padding: '10px' }}>
          <h2>{group.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default GroupManager;
























// import React, { useState } from 'react';

// const GroupManager = () => {
//   const [groups, setGroups] = useState<string[]>([]);
//   const [newGroupName, setNewGroupName] = useState('');

//   const handleAddGroup = () => {
//     if (newGroupName) {
//       setGroups([...groups, newGroupName]);
//       setNewGroupName('');
//     }
//   };

//   return (
//     <div style={{ width: '100%', height: '25vh', overflowY: 'scroll', border: "1 | 2 | black"}}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <h1>Calls</h1>
//         <div>
//           <input
//             type="text"
//             value={newGroupName}
//             onChange={(e) => setNewGroupName(e.target.value)}
//             placeholder="Group name"
//           />
//           <button onClick={handleAddGroup}>Add Group</button>
//         </div>
//       </div>
//       {groups.map((group, index) => (
//         <div key={index} style={{ border: '1px solid black', margin: '10px 0', padding: '10px' }}>
//           <h2>{group}</h2>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default GroupManager;