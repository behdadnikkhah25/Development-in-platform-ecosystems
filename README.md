# Group 7 

Our code is located within the folder IN5320-Project > src.
Due to some problems we are now using the **Group 22** instance. It happened when updating inspections on Sunday, after we had gotten it to work. We are a bit unsure as to what caused it, but both programs, and program stages were deleted from the instance. Our own instance worked with all features implemented up until that point.

## Available Scripts

In the project directory, you can run:

### `yarn install`

Installs the correct dependencies for the project.

### `npx dhis-portal --target=https://research.im.dhis2.org/in5320g22  `

Sets up the proxy portal to our DHIS2 instance. 

After running the command, our proxy should be available on [http://localhost:9999](http://localhost:9999).

### `yarn start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

### `yarn test`

Launches the test runner and runs all available tests found in `/src`./>

Logging in should be done with these credentials:

**Username**: in5320
**Password**: *not changed, see devilry submission*

## External libraries

Our application includes DHIS2, which is a given. However there are other libraries included as well, which are the following.

### [Leaflet](https://leafletjs.com/) 

Open-source JavaScript library for mobile-friendly interactive maps. 
It weighs about 42 KB of JavaScript code. We are using Leaflet to create inputs with interactive maps.

### [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

A very light-weight solution for testing React components.
It provides light utility functions on top of **react-dom** and **react-dom/test-utils** in a way that encourages better testing practices. We are using React Testing Library to test our components in jest, which is built in for DHIS2. We have also imported **react-hooks** from Testing Library.

### [Dexie](https://dexie.org/)

A lightweight, minimalistic wrapper that provides a straightforward API for developers using IndexedDB. We are using Dexie to make our offline feature functional, as well as storing the users recent searches. 

## Other external resources

While these aren't imported libraries or anything, knowing where they come from and why is still useful.

### Icons: [Material Symbols](https://fonts.google.com/icons?icon.query=arrow&icon.size=28&icon.color=%23FFFFFF&icon.style=Rounded)

The choice of using Material Symbols stems from DHIS2. We had a look at the icons in DHIS2, which proved to lack some of the visual clarity we were seeking, and therefore set out to find others. Since DHIS2 uses Material Icons themselves, we decided to use Material Symbols, which is the updated version of Material Icons. This preserves the styling throughout. All icons are imported through pasting the SVG files in our code.

## Application Overview

The application is designed to help school inspectors in Edutopia perform their duties more efficiently. It is built on DHIS2, which is a system used for education management across the country. The goal is to make school inspections digital. Previously, inspectors used paper forms and Excel sheets, but now they can use this application instead. This will make it easier to collect and analyze data about the schools, resulting in better reports and evaluation.

The application includes functionalities for:

- **Efficient Data Collection**: The application allows inspectors to easily and effectively register school inspection data using an intuitive form built with DHIS2 components.

- **Data Quality**: The application implements basic validation rules to maintain data quality. It provides immediate feedback to users for incorrect or unexpected inputs, enabling real-time corrections.

- **Integration with DHIS2**: The application is integrated with the DHIS2 platform, using the tracker endpoint to handle data and consistent terminology and design elements that align with DHIS2's mental models.

- **User-Friendliness**: The application is designed to be user-friendly, following familiar workflows and making the transition from paper-based systems to digital systems smooth and intuitive for school inspectors.

- **Add New Schools Functionality (Feature 1)**: This feature allows inspectors to register new schools by capturing basic details, geo-coordinates, and photos, notifying district officers for further processing. After adding a school, inspectors are able to create new inspections for the school immediately after creation. 

- **Offline Functionality (Feature 2)**: Inspectors can continue their work in areas with intermittent internet connectivity by storing data locally and syncing it with DHIS2 when a connection is restored. The offline feature handles it seamlessly and gives the user an indicator for whether or not the user is offline or online, and upon storing data, or syncing to the API.

- **Editing inspections**: After creating an inspection, the newly created inspection will show up in previous inspections for the school. Clicking the view previous inspections allows the user to further see what has been logged previously and may click any non-complete inspection to edit values and status.

  

## Functionality

### Adding school Inspection events to the API

This application is designed to assist school inspectors in collecting essential data as part of the DHIS2 school inspection event program, enabling an efficient transition from paper-based workflows to a digital system.

#### Features

The application includes the following functionalities:

- **Data Collection Interface**: 
  Provides an intuitive form built with DHIS2 components, allowing inspectors to easily register essential school inspection data within the DHIS2 school inspection event program.

- **Validation and Feedback**: 
  Implements basic validation rules to maintain data quality. Users receive immediate feedback for incorrect or unexpected inputs, enabling real-time corrections and ensuring the accuracy of data entry.

- **Efficient Data Handling**: 
  Utilizes the `useDataMutation` hook for efficient data submission and mutation within the DHIS2 framework, ensuring reliable interaction with the tracker endpoint.

- **Consistent Terminology**: 
  Uses terminology and design elements that align with the existing mental models and experiences of school inspectors, which helps facilitate a smooth transition from paper-based workflows to a digital environment.

- **Enhanced Digital Workflow**: 
  Takes advantage of digital tools to streamline the data collection process while preserving familiarity for users, making the workflow both efficient and easy to adopt.

#### Usage

The application is designed to be user-friendly, making data collection straightforward for school inspectors. The form interface allows inspectors to input necessary school inspection data, which is validated before submission. This ensures a smooth transition from traditional methods to the DHIS2 platform, improving both the efficiency and accessibility of data capture.

----------------
### Add New School Functionality

This module enables you to create and manage new schools (a child of organization units) in the DHIS2 system and link them to a program, specifically for school inspections.

#### Features

The module provides the following functionalities:

- **Create New Schools**:  
  Register new schools in the system with details such as name, associated cluster ID, and coordinates. The system automatically generates an opening date for the school.  

- **Link Schools to Programs**:  
  Connect schools to specific programs in DHIS2, such as the school inspection program, by sending the school’s ID to the program.  

- **Update School Information**:  
  Update school details, including adding or modifying an image. This is done by sending the school’s ID and image ID to the system.

#### Usage

The module is designed to be user-friendly. To create a school, you provide the necessary details, and the system generates a unique ID for the school. This auto genetated ID can then be used to --link the school to differnt programs and update the information about schools.

-----------------------
### Offline Features

Offline functionality is implemented using Dexie.js, an IndexedDB wrapper, to store data for school inspections and the creation of new schools locally when the app is offline.  

#### How It Works

The offline features include the following components:  

- **Local Storage**:  
  Forms save data to Dexie tables when the app is offline.  

- **Sync Manager**:  
  - Monitors the connection status using `navigator.onLine`.  
  - When the app reconnects to the internet, the Sync Manager:  
    - Retrieves data from Dexie tables.  
    - Syncs the data with the DHIS2 API using `useDataMutation`.  
    - Clears the local data upon successful synchronization.  
------------------------
### Extra features

In the process of developing the application we added some extra features to better user experience. We added a profile for the user to easily be able to change their profile picture, name and last name. We also used the database to store the users recent searches up to the last 50. The searches are stored with amount of time it has been completed and the last time it was completed, allowing us to sort for both values when retrieving the search history. We also have the feature for editing a completed inspection, which the user may do either through the dashboard for his or hers recent inspections. Through 'Change cluster', there is also the possibility of changing away from your assigned cluster. The default cluster will still be set to your assigned cluster the next time you log in.

## Missing features and improvement

**"Errors":**
On the last day of delivering, just 2 hours before deadline, removed these lines from FileInput, as people were having issues with it triggering, but it was impossible to reproduce for the one who implemented it (Andreas), so we decided to remove the lines. They essentially served as a way to still target the remove button from file input. This means the user now cannot remove it by clicking the button, but will instead have to reupload. This does not effect usability and only applies to profile, which is not a required feature, so therefore we do not consider it a missing feature, or that it affects the user experience in regards to the assignment.
Lines in question:
```        
if (event.target.closest(`.${classes.removeSvg}`) || event.target.closest(`.${classes.fileListItem}`)) {
return;
}
```

While we have no missing required features, there are certainly room for improvement in regards to the features we have and some other we wished to implement for the sake of the user.

- **Viewing school profile:** While we are storing schools correctly along with their image, we would have liked to implement a card to show the school along with it's image. It's is possible to view it as it is now on the DHIS2 maintenance site, but making it possible to be seen the same way we do with the users profile would have been ideal.
- **Last inspection for school:** For the schools shown on dashboard we initially planned to implement a way for the user to see when was the last time a school had been inspected. While we managed to get the feature working, it was later removed for a few reasons. The reasons stems from our focus on not straining the users mobile data in order to query the entire table of schools and the all the inspections to add it to the table. We tried implementing it through combining with filtering the events, but ultimately fell short with some errors.
- **Query optimization:** While we have done our best to optimize queries, they could definitely be further optimized. There are some cases were we are unsure if the approach we intended would be correct or if it would be simpler/more efficient to do it some other way.
- **Testing:** We have tested most classes and functions, but had we had more time, we would have liked to implement further testing, as we currently do not have that for certain pages and components. The reason for this being lack of packages we would have to implement, and lack of time.
- **Search storing logic:** It is an extra feature we added, but it could be optimized, as it currently does not have a lot of checks for if a word is similar to another existing word to avoid unnecessary additions and removals from the database. We have done some optimization through not making the search be stored until a school or cluster is actually clicked. Not having this clause would trigger a lot of unnecessary removing and adding for the database.
- **Code structuring:** Most of the code has been refactored to be outside of view classes and prevent duplicates. However we are aware that there is code in some places that are still duplicate and could be refactored to make the application smaller in size.
- **School programs:** While we are currently adding the school to the program for creating new inspections, we tried to add it to the students and staff programs as well. This however did not work out and returned errors, so the code is commented out. It makes sense for a school to be implemented in those programs, even if the task does not mention it, so we figured it would be a great addition. Since the logic seems correct, we chose to just keep it, with it being commented out, to show the logic, and make it easy for the next person to implement it further down the line in a real world scenario. While this could take up unnecessary space, it is only about 10-15 lines of code, which is very minimal compared to the time it would take someone to look up the correct information.
