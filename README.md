# Colenso Project

# REFER TO [CLOSED ISSUES](https://github.com/MisterTJB/Colenso-Project/issues?q=is%3Aissue+is%3Aclosed) FOR A RECORD OF COMPLETED SCENARIOS (i.e. all scenarios (issues 1-10) have been completed)

## Background
You will be given a collection of XML files representing a collection of historical New Zealand documents - primarily letters. You will design and build a website to allow users to browse, explore, and work with these documents.
The requirements and personas for this assignments are based on the Colenso Project. Students who get an A- grade or higher will be asked to allow researchers from the Colenso Project access to their video to provide more detailed feedback (this will not be marked - this is useful because they are the actual target audience and they hire programmers). Selected projects (as chosen by Colenso Project researchers) may be invited to be promoted as viable prototypes for digital humanities projects.

## Personas

### Researcher Rachel
Researcher Rachel is a history researcher who is interested in using historical letters to learn more about the world. She uses a tablet occasionally when showing things to other people.

### Administrator Adam
Adam needs to add new letters to the system. He also edits letters, adding in markup to the text, as well as metadata. While most of his work is done the first time a letter is entered into the system, sometimes he needs to go back and add more later. He works exclusively on a desktop computer. While he is happy using a computer, he is not especially technically skilled.

### Student Siobhan
Siobhan is a summer student who has been assigned to work with Researcher Rachel. She needs to quickly explore the collection to find some data that she can then use to create a small presentation. She likes to work on her cellphone, tablet, and computer as the mood takes her. She is not familiar with most of the technologies that she is going to need to use in her work, but is happy to try and learn.

## Assessment
For each part of the assignment you must implement the required scenarios in a user friendly and accessible fashion. To achieve an A+ all the scenarios and features must be implemented, demonstrate excellence in ease of use and user friendliness, work on mobile and desktop sized displays, and be demonstrated in the video submission.

You will build a website that allows users to explore the database of letters. It also allows addition of documents. The website should support different screen size from standard desktop size to mobile device size. It must work on the university versions of both Chrome and Firefox.

Mobile screen size compatibility only needs to be demonstrated as working if the browser window is shrunk down. There is no requirement (or additional marks) to support real mobile devices. This is because your mobile browsers may not exhibit exactly the same behaviours as the schools versions of Chrome and Firefox (which themselves may not match). To minimise the difficulty from making websites which are compatible with most browsers, we restrict ourselves to specific versions of two browsers.

There is no authentication - everyone is allowed read / write access to the database. This requirement is there both for simplicity, but also because this project is meant to be open.

It is highly recommended that you use a BaseX database to store the XML. The XML files are available here.

### Scenarios (Core)

#### Scenario One
Researcher Rachel wants to search the documents based on text strings. As a digital historian, she expects logical operators (AND, OR, NOT) and limited wildcard expressions to be supported by the search.

#### Scenario Two
Student Siobhan wants to search the documents based on markup. She would like to use XPath / XQuery queries to find all documents which contain a given tag, both to use the resulting data, and to see if there are enough documents that contain the relevant data for her to use. Siobhan may not be familiar with XPath, but she needs to use it because the world is a rough place and she is determined to succeed. Siobhan should not need to write TEI namespace information in her queries as all the documents are TEI and it is therefore implied.

#### Scenario Three
All users want to browse the documents, and view the letters in a nice human readable way. They should be able to save the raw TEI of a document that they are looking at. If they email the current URL to a colleague both will see the exact same document.

### Scenarios (Completion)
You will extend the system created in the core with additional searching and maintenance features.

#### Scenario One
Administrator Adam wants to add a new letter, which is already in XML (TEI) to the collection.

#### Scenario Two
Student Siobhan is exploring database and wants to do nested searching within results. Once she has completed her searching (which may contain more than one level of nested searches), she wants to download the full raw TEI of every document that has matched her query.

#### Scenario Three
Student Siobhan has found some data that she wants to change the mark up on. This may be incorrect markup, or something that she wants to add in. However, she doesn't want to have to download the letter, edit it, then reupload it. She wants an webpage were she can easily make these small corrections. Her corrections should also be checked against the TEI schema to ensure that she has not made any typos.

### Scenarios (Challenge)
In the challenge you will add more features to the system that you built in the core and completion.

#### Scenario One
All users want advanced search results display showing context, per document statistics, overall statistics

#### Scenario Two
Administrator Adam wants to have a record of what searches have to been done to ensure that the things that are commonly being searched for are prioritised to have mark up. Student Siobhan wants to have a record of what searches have been done so she can see what other people have been searching for, as well as having a record of all of her searches.

#### Scenario Three
After substantial work Student Siobhan has done a search that has provided all the (or exclusively) references to a single object, place, person or time. She now wants to generate XML (TEI) markup from her search that will be added to all the relevant documents so that other people can use the results of her work. E.g. she identified all the places where a search for 'Nelson' refers to the person Nelson (as opposed to say the place) and now wants to mark all those as such.

#### Scenario Four
Write and implement your own scenario
