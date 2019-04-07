<h1 align="center">Synonyms Anywhere</h1>
<p align="center">An Electron app that gives you a super quick synonym searching tool with the press of a hotkey.</p>
<p align="center">
  <img src="https://i.imgur.com/729DiyD.gif" alt="Syonyms" height="500">
</p>
<p>
  The first ever Javascript project I made was a site that would allow you to find synonyms of a given word. It was super rudimentary, but it taught me a lot about how webapps work. So when I decided I wanted to learn Electron, I figured I'd rehash that old idea for my first project.

  This app runs in the background and allows you to use a hotkey (ctrl+shift+aspstrophe) to pop up a quick synonym finder on the top right of your screen. It appears on top of any content and disappears after a few seconds so it's super useful while writing a paper or responding to emails when you just can't think of a good word to use. You can click on the words themselves to copy it and get right back to your work!

  It runs in the background and uses very little data (the only request it makes is when you search for a word), plus it's all open source! The code is separated into the "main" and "renderer" folder, where the main folder contains the Electron setup code and the renderer folder contains the React app that runs everything inside the popup window.

  You can download the prepackaged setup exe [here (Synonyms Anywhere Setup 1.0.0.exe)](https://github.com/Egrodo/synPopup/tree/master/main/dist) or you can clone the code and build it yourself using by running the commands `npm run build:renderer` then `npm run dist` in the main folder.

  Thanks for reading!
</p>