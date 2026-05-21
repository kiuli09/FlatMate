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

1. Login and Logout functionalities
2. Create a flat 
3. Join a flat
4. Add a shopping item into the shopping list
5. Delete a shopping item from the shopping list
6. Mark an item as purchased and move it into the flat inventory
7. Add an Item into the inventory
8. Update an items quantity in the inventory
9. Remove an item from the inventory
10. Add a receipt to an expense in the finance page
11. Change receipt for an expense
12. view receipt for an expense
12. Delete expense.
13. Add an event to the timetable
14. Edit an event in the timetable
15. Remove an event from the timetable
16. Change from light mode to dark mode by clicking the moon emoji next to the user icon on the right of the site header.
17. change from dark to light mode by clicking the sun emoji next to user icon.
18. In flat settings, Update the flat name
19. In flat settings remove a member from the flat
20. Go to user settings by clicking on the user icon on the top right. Then update the users display name
21. Reset user password
22. In the dashboard, click the members block to get a list of current flat members.
23. In the dashboard. Use the quick action buttons to redirect.

# Known Issues
- Creating a flat with a large number for members throws a server error.
- Expenses are displayed wrong, the name isnt rendered and the created by tag doesnt display the users name, but their id. (not intended)
- Expense filter by type also doesn't work as intended, as type is pulled from the category input rather than the selection box (One-time, weekly, monthly)
- Timetable UI may break when more than 2 events overlap the same cell.
- When a User is removed from a flat, expenses do not properly deal with the removed user.
- Because expense type is broken, it cannot be properly fetched onto the dashboard upcoming bills block.