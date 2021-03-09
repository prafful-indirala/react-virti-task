Please complete the following tasks:

- Clone (not fork) this repo and run `npm install` then run `npm start` to start.
- Render the video found in the public folder on the page. Make it as pretty (or as ugly) as you like. Using a **native html5 video component** is preferred. You can also migrate the project to use typescript if you'd prefer (or create a separate react repository and import the video asset).
- Set up a basic websockets implementation with node (or other back-end) that the user connects to via the React app. You may also use WebRTC instead.
- Create some inputs on the video page that submits some text, a timestamp, and duration (or two timestamps) that sets the text to be shown at a given time during video playback
- Ensure that websocket (or WebRTC) changes are propagated across everyone connected to the app (so all users see the text updates)

Bonus objectives:
- Create inputs that send positions for x/y coordinates/percentages for positioning the text that shows
- Provide some styling customisability for the text that shows (e.g. color, background, bold, italics, font, transitions)
- Allow for images to be submitted and viewed with the same time-based customisability as the text
- Make it pretty!

Feel free to ask any questions, as well as to have fun and expand on the specification as much as you like (e.g. unit/integration tests, custom controls, fullscreen toggle button, text that runs away from your cursor etc.). 

If you're struggling, take notes about areas you are having trouble with, proposed solutions you have considered etc.

Please create a new git repository with your project and send us a link to it. Alongside this, please provide a screen recorded video or brief text-documented overview of your development process where you describe the process behind building the app and run through any thoughts you had, decisions you made, concerns that came up etc.