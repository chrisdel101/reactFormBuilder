[Demo](https://chrisdel101.github.io/reactRobots/) 

`npm install` then `npm start`

It satisfies all the conditions of the assignment and works without any obvious bugs. It satisfies the bonus component too.

Taking feedback from the previous assignment, I made the data stores for this all as objects rather than arrays. This is to allow for constant time indexing. 

However in retrospect these are the things I would have done differently: 
1. I should have used Redux (although learning it here would have been tough). There were tons of bugs because of state going back and forth. Redux might have helped.
2. I should have consulted a guide on how to architect this type of app, rather than doing it on the fly.
3. I would not have used objects but rather arrays. There are no searches that would benefit from having objects, and array are SO much easier to set up.

I am happy to have any feedback. 