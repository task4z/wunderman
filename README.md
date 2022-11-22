# WTC Technical Test - Movies List Page

There are 3 test options - you will have been instructed which test(No. 1, 2 or 3) to complete. There are full instructions on the main landing page together with user stories, designs for each test and the links to the Swagger APIs.  Depending on which test you do, you will be asked to fetch all movies, add filters and create a cards carousel, all of which should include meaningful unit tests.

To help you, the FE application is already connected to the API and there is a shared library of components you may want to use.  We are going to be assessing your implementation so how much time you spend on this is entirely up to you.


When you have committed and pushed your code, send an email to your recruiter and we will then review your implementation. 

Good luck!

## André Lourenço notes

- To run the e2e test the setup need to be changed maybe set it to use the answers and run the command based on the answer.
- When using padding 8px between stars and the size of the star of 24px with the width of 140px,`5*24+8*4=152`the stars overflow because 152 > 140 so I used 5px between the stars.



## Run the application

`yarn && yarn start`

## Run Tests

`yarn test application-name`

Example:

`yarn test fe-wtc-tech-test`

## Run E2E Tests

`yarn e2e application-name`

Example:

`yarn e2e fe-wtc-tech-test-e2e`

## Run Linter

`yarn lint application-name`

Example:

`yarn lint fe-wtc-tech-test`

## Import files

Libraries are sharable across libraries and applications. They can be imported as:

`@mono-nx-test-with-nextjs/mylib-name`.

You can go in tsconfig.json and look at the paths property for more info.

Example:

`import { componentUi1, componentUi2 } from @mono-nx-test-with-nextjs/ui`
