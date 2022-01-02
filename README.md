# Pipes - Your go to website for Course Progression Evaluation

This website allows monash users to upload their csv files that are downloaded from Callista to out platform. In which results can be obtained once the processing is done.

<br>

Front End Repo [here](https://github.com/PVCPipes/pipes-frontend).

## Technical Workflow

1. File is uploaded from Front End
2. Information is parsed to be in JSON format
3. various rules (a.k.a Program Requirements) are checked against the parsed information to evaluate course progression.
3. Course progression information will be sent back to Front End.

<br>

## Features Offered

1. Simplicity - Simple "Upload & Go" platform allowing users to just upload everything in one setting.
2. Advanced Analytics - users are able to view various kinds of analytics from the results provided (e.g. missed core units, percentage amount of credit points achieved, etc.)

<br>

## Enabling Technologies

1. Nest.js - Main Code Base
2. AWS - Server Hosting + DB Hosting

<br>

## Limitations

1. Lack of access to Callista's database - would enable us to directly call the query endpoints instead of processing csv files

2. lack of info consistency on Monash Handbook - making it difficult to retrieve necessary data from Monash Handbook

<br>

## Future prospects

1. Integration with Callista - complementing the course progression framework

2. All backend to be put in Back End - easier management

<br>

## Team Members

Min Hao - Project Manager <br>
Blaise Tiong - Tech Lead <br>
Wei Chun - Tech Lead <br>
Sauce Foong - Tech Lead <br>
Ally Teh - UI Lead
