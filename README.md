# RankRise

The goal of this website is to help users choose the best product in their case.

**Idea**:

- Q/A website

- Voting platform

- Recommendation platform

- Ranking platform

- Comparison website

- Alternative searching platform

- Product rating platform

**Features**:

- User has username, email and avatar + social auth?

- Ask questions

- Answers as products (services)

- Product/service search/suggesting

- Questing tagging/categories (categorization)

- Pros/Cons answer rating

- Pros/Cons commenting

- Answer name, website link, images, videos (links)

- Answer rank (rating) calculation/*algorithm*

- Questing/answer search

- API request throttling

- API testing & documenting

- Reporting feature (report questions/products/answers/comments)

- Question/product throttling/ban

**Similar websites**:

- Twitter, Reddit

- Quora, StackOverflow

- Slant, ProductHunt

- Alternative.to

**Plan**:

- Project development setup

- Authentication/Authorization

- Documentation

- Automated testing + test coverage

- CRUD components API
  
  - Model
  
  - Serializer
  
  - API view/view set
  
  - Manual testing
  
  - Automated testing

**Technology stack**:

- Python, Django, Django REST Framework, PostgreSQL

- dj_rest_auth, pytest/coverage, Swagger, django_dotenv

- black, pylint, isort, rope

- AWS/Heroku, Docker, Compose, Github, CI/CD

**Technological features**:

- OpenAPI, Swagger

- Searching in database technology

- JWT authentication

- Test driven development

- Debug Django container

**Roadmap**:

- [x] dockerize project + PostgreSQL (setup dev environment)

- [x] migrate + custom user model

- [x] move from session to JWT authentication

- [x] authentication endpoints

- [x] API documentation generation

- [x] Automated testing

- [ ] Questioning feature

## Question

Questions are the core of API.

API:

- Users (authenticated) can only ask questions. There should be some kind of throttling to prevent users from spamming a lot of questions. 

- Any one can only list and retrieve questions.

- Only admins can delete or update questions (maybe based on reports).

Models:

- Questions aren't bind to any user (not owned). A question is just a small text around 100 characters which has some (category) and ask_time. Question should be looked up by primary key (integer id or character slug).