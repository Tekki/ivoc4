![iVoc Logo](https://ivoc.tekki.ch/images/ivoc-logo-opak-277x200.png)

# Introduction

iVoc is a vocabulary and form trainer that stores its data in spreadsheets on [OneDrive Personal](https://onedrive.live.com/about/de-de/) or [OneDrive for Business](https://onedrive.live.com/about/de-de/business/). It works according to the learning method described by [Sebastian Leitner](https://en.wikipedia.org/wiki/Leitner_system). In short, this means that the program knows when and how often it has to ask which question.

You find a live version of iVoc4 at [ivoc.tekki.ch](https://ivoc.tekki.ch/). Take a look at the [sample course]((https://ivoc.tekki.ch/#/course/sample) to see how it works.

# Learn, learn, learn

You can use iVoc to **learn languages**.

Or you can use iVoc, the one here on GitHub, to **learn programming**, more specific to see how to combine [Vue.js](https://vuejs.org/), [Vuex](https://vuex.vuejs.org/) and [Bootstrap-Vue](https://bootstrap-vue.js.org/) with the [Microsoft Authentication Library](https://github.com/AzureAD/microsoft-authentication-library-for-js) and the [Microsoft Graph API](https://developer.microsoft.com/en-us/graph/docs/concepts/v1-overview).

Finally, those working at this project can **learn from you** if you open an issue and create a pull request to correct the errors you find in this repo.

# Getting started

## Vocabulary Training

The simplest way to use iVoc for language training is to log in with your Microsoft Personal or Business Account to the [live version](https://ivoc.tekki.ch/). This will create an application folder `iVoc4` in your OneDrive.

Next, download the template listed on the [About page](https://ivoc.tekki.ch/#/about). Create a new Excel spreadsheet following the instructions in the template and copy it to the `iVoc4` folder. To get active, the name of the file has to start with `iVoc-` and to end with `.xlsx`, for example `iVoc-my first foreign language.xlsx`. Other files will be listed, but iVoc won't open them. Press the **Refresh** button to update the file list, or if you're logged out, log in again. Click on the name of the file and start learning.

While you answer questions, the spreadsheet is updated continuously. You can stop anytime and continue later at the same place, on the same or on another machine.

If you're concerned about **your privacy** note that only the application running in your browser, not our server accesses your data on OneDrive and that its permissions are limited to the `iVoc4` folder.

## Development

To work with and on the source code, you need [Node.js](https://nodejs.org/). Next install Vue.js and Vue-Cli.

    npm install -g vue
    npm install -g @vue/cli

Clone this repo and install the Node modules.

    git clone https://github.com/Tekki/ivoc4.git
    cd ivoc4
    npm install

Start the development server and start to edit the code.

    npm run serve

The App ID included in this repo will only allow you to work on [localhost:8080](http://localhost:8080) or on ivoc.tekki.ch (what we won't allow). If you plan to place the program elsewhere, you have to obtain your own ID at the [Microsoft App Registration Portal](https://apps.dev.microsoft.com/). You'll need at least the delegated permission `Files.ReadWrite.AppFolder`. Create a file `.env.local` with your App ID and optionally the permission scopes (separated by spaces).

    VUE_APP_ID=my_app_id
    VUE_APP_SCOPES=Files.ReadWrite.AppFolder another_scope

# History

The number 4 correctly suggests that this is not the first version of the program.

The iVoc project started in the years when every name related to computers had to start with 'i', around 2006 or 2007. **iVoc1** was a [Java](https://java.com/) application that stored its data in Excel files. As a Java program, it could run on all operating systems, but you had to copy the spreadsheets from one computer to the other. Software history rarely leaves traces, so there is probably not a single copy of iVoc1 existing in this world.

**iVoc2**, build in 2008, was the same program with a friendlier user interface. It had a lot of semi-transparent elements; something that still echoes in the actual logo.

**iVoc3** from 2009 introduced some new concepts. It played with experimental features of Java like translucency. More important, the data source moved from local files to [Google Docs](https://www.google.com/intl/en/docs/about/) and the program was delivered from the webserver as a [JNLP](https://www.java.com/en/download/faq/java_webstart.xml) application. From then on, you could use it anywhere, anytime (if you had Java and access to the internet). Additionally, it replaced the simple learning box system by the more sophisticated [Leitner system](https://en.wikipedia.org/wiki/Leitner_system).

After an update in 2010 the project went to sleep until 2018. **iVoc4** moves back to Excel, but accesses spreadsheets stored on OneDrive. It replaces Java with JavaScript running directly in the browser, so you no longer have to install additional software on the client. It's still based on Leitner's ideas, and it's open source. The data structure only changed slightly all over the time. Depending on the point of view, iVoc4 is a completely new software or still the same as 10 years ago. This may motivate you to a contemplation about progress in software development.
