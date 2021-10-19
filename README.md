# RankRise

The goal of this website is to help users choose the best product in their case.

**Idea**:

- Q/A website (question answer/solution/option/recommendation)

- Voting platform

- Recommendation platform

- Ranking platform

- Suggesting platform

- Comparison website

- Alternative searching platform

- Product rating platform

- Community centered

**Features**:

- User has username, email and avatar + social auth?

- Ask questions

- Answers as products (services)

- Product/service search/suggesting

- Question tags/categories (categorization)

- Multilayer categories

- Pros/Cons answer rating

- Pros/Cons commenting

- Answer name, website link, images, videos (links)

- Answer rank (rating) calculation/*algorithm*

- Questing/answer search

- API request throttling

- API testing & documenting

- Reporting feature (report questions/products/answers/comments)

- Question/product throttling/ban

- Follow question options/last update

- Question comments

- Question sharing/linking

- Option score calculation

- Product community specs (+proc/concomments)

- Product price (free, paid, open-source)

- Recommendation community agreement

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

- Throttling

- Pagination

- Search

**Roadmap**:

- [x] dockerize project + PostgreSQL (setup dev environment)

- [x] migrate + custom user model

- [x] move from session to JWT authentication

- [x] authentication endpoints

- [x] API documentation generation

- [x] Automated testing

- [x] Questioning feature

- [x] Test-driven development

- [ ] Product CRUD

- [ ] Search

## Question

Questions are the core of API.

API:

- Users (authenticated) can only ask questions. There should be some kind of throttling to prevent users from spamming a lot of questions. 

- Any one can only list and retrieve questions.

- Only admins can delete or update questions (maybe based on reports).

API:

- list, retrieve - unauthenticated users

- create - authenticated users

- update, destroy - authenticated staff users

Models:

- Questions aren't bind to any user (not owned). A question is just a small text around 100 characters which has some (category) and ask_time. Question should be looked up by primary key (integer id or character slug).

## Product

Product represent some product or service that can be recommended as an option to specific question. Usually it is online/software or Internet service/product. 

- id

- name (title, help text: you can not change name after)

- slug (automatically based on name)

- description

- images (links or *filesystem storage*: Django package)

- product website link

- price/cost (*choices* from: open source, free, paid)

Validation/Model:

- id is a auto incrementing primary key (model)

- name and slug must be unique

- price should contain values only from choices

- website link must be valid URL

- description can be blank

- slug (URI) must not update after name update

- name and slug can not be changed in serializer/API

- name can not be blank

- description, website can be blank

- price default set to free (model)

- name must be <= 50 characters

- images must have image media type

URLs:

- Products should be available under /products/ URL

Serialization:

- Products should include images objects

API permissions:

- retrieve, list: unauthenticated

- create: authenticated

- delete: staff

### Product image

Image of the product, has the have API permissions as product.

Model:

- image field
  
  - 300x200
  
  - JPEG
  
  - 80% source quality

Permissions:

- Same as models

URL:

- Image will be available under /products/images/