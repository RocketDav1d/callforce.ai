import { render, screen } from '@testing-library/react';
import GroupManager,{ GroupItem } from '@/components/GroupManager2'; // Adjust the import path as needed
import axios from 'axios';






// ------------- GroupItem -------------------------------

jest.mock('axios');

const mockGroups = [
    { id: '1', name: 'Group 1', chats: [] },
    { id: '2', name: 'Group 2', chats: [] },
  ];

describe('GroupManager', () => {
  it('renders group names', async () => {
    // Mocking axios response
    axios.get.mockResolvedValue({ data: { groups: mockGroups } });

    render(<GroupManager />); // Arrange

    // Assert that group names are rendered
    const group1 = screen.getByTestId('group-name');
    const group2 = await screen.findByText('Group 2');

    expect(group1).toBeInTheDocument();
    expect(group2).toBeInTheDocument();
  });

  // Other tests go here
});







// ------------- GroupItem -------------------------------


const mockGroup = {
    id: '1',
    name: 'Test Group',
    chats: [
      {
        id: 'chat1',
        chatName: 'Chat 1',
        createdAt: '2021-10-10',
        summary: 'Chat summary 1',
        fileKey: 'fileKey1',
      },
      // ... other mock chats as needed
    ],
  };
  

  

describe('GroupItem', () => {
  describe('Render', () => {
    it('should render chat details', () => {
      render(<GroupItem group={mockGroup} />); // ARRANGE

      // ACT
      const chatName = screen.getByText(mockGroup.chats[0].chatName);
      const chatDate = screen.getByText('10.10.21'); // Adjust date format if needed

      // ASSERT
      expect(chatName).toBeInTheDocument();
      expect(chatDate).toBeInTheDocument();
    });

    // Add more tests as needed
  });

  describe('Behavior', () => {
    // Behavior tests go here
  });
});