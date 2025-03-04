# NaviPartner tech test

## Get started

Run `yarn install` and `yarn start`

## Project Structure

Feel free to create new files to help you complete these tasks. Additional dependencies can be installed.

`src/entry.tsx` is your react entry point.

`src/data` directory is a mocked-API which exposes methods to get/delete/update user & blog-post information.

Your tasks will be to add further logic to display and manipulate the data returned from these functions, without modifying data/index.js.

You will find some template code in the test, which serves as a guidance to get you started. Feel free to either improve the template code or completely replace it with your own code - that is fully up to you.
With the template code you will also find some TODOs, these are intended as starting points for how to approach the tasks below. If you want to solve the tasks in another way than following the TODOs, then you are more than welcome to do so as well.

## Evaluation
It is no requirement to solve all of the below tasks (and bonus points), we will at all times prefer quality over quantity. A few well-made and good-looking components weight higher than completing every task at lower quality. 
It is up to you to decide, how many tasks and how much time to spent on each task will be sufficient to fully demonstrate your skills.

## Tasks

1. Render a table of all users.
2. Render the table in a performant way.
3. When you click on a user row, it should expand the row and show the blog posts that belong to the user.
4. You should be able to click on a blog post row, it should navigate to the blog post page (url should update).
5. When on the blog post page, you should be able to click a Back button to get back to the users list page.
6. You should be able to edit the blog post title & body.
7. You should be able to delete users.
8. You should be able to delete blog posts from the table, and from the blog post page.
9. You should be able to add new blog posts for a user.
10. It should be responsive & reasonably pretty.

## Bonus points for:

1. Write appropriate unit-tests using React Testing Library.
2. Consider accessibility.
3. Ensure you are delivering 0 linting errors and 0 test failures.
4. Feel free to add additional features to improve the user experience such as filtering, loading-spinners, anything else creative.
