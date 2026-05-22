# Feasibility Study

## Technical Considerations

FlatMate is a web-based application designed to help flatmates manage shared household responsibilities such as groceries, expenses, pantry inventory, and flat notices. The system will consist of a frontend interface for users to interact with, a backend server for handling application logic, and a database to store information related to users, expenses, grocery lists, and inventory items.

The technology stack that will be used includes JavaScript with React for the frontend, Node.js with Express for the backend, and PostgreSQL for the database, with deployment planned on a cloud-based platform such as Render or AWS. These technologies are commonly used and suitable for scalable web applications such as FlatMate. As we already have experience working with these tools, this will reduce the amount of learning required to use the technology stack effectively.

Overall, FlatMate is technically feasible as it can be implemented using existing technological tools.

---

## Operational Considerations

FlatMate is designed to address common challenges faced by people living in shared flats. These challenges include keeping track of shared groceries, dividing costs fairly, remembering who owes money, and managing pantry items that are shared between flatmates. It can be used as a centralised platform where flatmates can see and update essential shared information.

Users will be able to add groceries that are not currently in the inventory but need to be purchased, keep records of weekly or monthly expenses such as rent or utilities, and track the items in the inventory. The system will also calculate fair splitting of expenses based on how the flat agrees to divide costs.

This reduces confusion, miscommunication, and improves transparency between flatmates, while also providing a reliable point of reference if disagreements arise. FlatMate will be designed to be simple and intuitive, ensuring that users do not require significant technical knowledge to use it effectively. The application will run on common web browsers such as Chrome, Edge, and Firefox, meaning users will not need to install any additional software.

Given that the system aligns with real-life issues faced when flatting and is easy to use and access, it is operationally feasible.

---

## Schedule Considerations

The development of FlatMate will follow an Agile approach using a series of sprints to structure progress. The team plans to complete approximately three main sprints, each focusing on key components of the system.

The first sprint will focus on setting up the foundation of the project. This includes configuring the development environment, establishing the database, implementing user authentication, and creating the initial user interface design. The second sprint will focus on developing the core functionalities of the system, such as expense tracking, cost splitting, shopping list management, and inventory features. The third sprint will be dedicated to refining and polishing the application, including improving the user interface, fixing bugs, and ensuring overall usability and performance.

This approach allows the team to prioritise building a strong foundation first, followed by functionality, and finally refinement. By structuring development in this way, the project timeline remains realistic and achievable while allowing flexibility for improvements throughout the process.



---

## Resource Considerations

Each member of our team has taken computer science courses previously, meaning we have the relevant experience required to develop this project. All team members have access to personal laptops, and additional computers are available in university labs if needed, providing sufficient hardware resources.

For the project, we will be using free and open-source tools such as GitHub for version control, Visual Studio Code for development, and a cloud hosting service for deployment (to be confirmed). We will also use Taiga to track tasks across each sprint, including tasks that need to be done, are in progress, and have been completed.

These resources are sufficient to support the development, collaboration, and deployment of FlatMate.

## For Evidence Tracking
We are using Taiga to keep track of our user stories and tasks for implementations. The following link will direct you to our Taiga Page. 

https://tree.taiga.io/project/judithainuu-flatmate/taskboard/sprint-1-26374


## Software Delivery
We are using render to host and deploy FlatMate
https://flatmate-1-a8t9.onrender.com/

# Scope of Project

## User Authentication and Settings
1. Users can sign up for a new account
2. Users can log into their account
3. Users can log out of their account
4. Users can reset their password through User Settings
5. Users can update their display name through User Settings 

## Flat Management
6. Users can create a flat
7. Users can join a flat using join code
8. Users can update the flat name in Flat Settings
9. Users can add a member to the flat in Flat Settings (has to be an already existing user)
10. Users can remove a member from the flat in Flat Settings
11. Users can view current flat members from the dashboard members card.


## Shopping List
12. Users can add shopping items to the shopping list
13. Users can delete shopping items from the shopping list
14. Users can mark shopping list items as purchased which then moves the item into the flat inventory

## Inventory Management
15. Users can add items to the inventory
16. Users can update item quantities in the inventory
17. Users can remove items from the inventory
18. Users can add low stocked items in inventory to shopping list by clicking "Add to Shopping List" button that becomes available when item is low in stock

## Finance Management 
19. Users can add expenses to the Finance Page
20. Users can add receipts to each expense 
21. Users can view receipts attached to each expense 
22. Users can update/change receipt attached to each expense
23. Users can delete expenses. 
24. Users can view total amounts paid by the flat per category over the months trough the Summary Page
25. Users can filter the expenses by type
26. Users can see what people in their flat owe them and what they owe others

## Timetable Management
27. Users can add events to the timetable
28. Users can edit timetable events (add the change and then select update button)
29. Users can remove timetable events

## Dashboard and Navigation
30. Users can use dashboard quick-action buttons for navigation and redirection to the appropriate pages
31. Users can view and copy join code in dashboard
32. Users can see the number of items in the shopping list in the dashboard

## Appearance and Theme
33. Users can switch from light mode to dark mode by clicking moon icon in the site header
34. Users can switch from dark mode to light mode by clicking the sun icon in the site header

# Known Issues

## Flat Management
- Creating a flat with a very large member limit may cause a server error (numbers like 293837393739383937393839383938)
- There is currently no option for a user to leave a flat group themselves. They have to be removed from the flat settings page
- If a user removes their own email from the flat settings, it will only reflect once they exit the flat group
- When adding another user to a flat using their email, there is no confirmation message or alert displayed. The only indication is that their email appears in the members list

## Finance Management
- Expenses are displayed incorrectly:
    - The expense name isnt rendered properly
    - The "Created by" tag doesnt display the users name, but their id(not intended)
- Expense filter by type also doesn't work as intended, as type is pulled from the category input rather than the selection box (One-time, weekly, monthly)
- When a User is removed from a flat, expenses do not properly deal with the removed user.
- Because expense type is broken, it cannot be properly fetched onto the dashboard upcoming bills block.
- When adding an expense, the split does not include the user themselves when adding expenses as it was intended that when expense was added, the user has presumably paid their end of the expense. 

## Inventory and Shopping List
- When adding items to inventory or shopping list, theres no confirmation message that indicates that new item has been added, item will just appear. 
- When adding item to shopping list from the inventory page, there is no confirmation message displayed that indicates that item has successfully been added to the shopping list, youll need to check in the shopping list if the item is there
- When selecting purchased for items in the shopping list (moves it back to the inventory page), theres also no confirmation message displayed that indicates this has been done, youll need to check in the inventory page

## Dashboard
- The Upcoming Bills card in the dashboard does not reflect the expenses in the finance page properly. 

## Timetable
- Timetable UI may break when more than 2 events overlap the same cell.
- Input fields aren't cleared after removing an event.
