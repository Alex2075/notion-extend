
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);
}

function listenForClicks() {

    document.addEventListener("click", (e) => {

      function sendMessageToPage(tabs, commandName){
        browser.tabs.sendMessage(tabs[0].id, { command: commandName });
      }
      
      function save(tabs) {
        sendMessageToPage(tabs, "save");
      }

      function expand(tabs) {
        sendMessageToPage(tabs, "expand");
      }

      function collapse(tabs) {
        sendMessageToPage(tabs, "collapse");
      }

      function reportError(error) {
        console.error(`error: ${error}`);
      }

      if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
        return;
      } 

      let func = null;

      if (e.target.id === "save") {
        func = save;
      } else if (e.target.id === "expand") {
        func = expand;
      } else if (e.target.id === "collapse") { 
        func = collapse;
      }

      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(func)
        .catch(reportError);
      
    }) 
}

browser.tabs
  .executeScript({ file: "/content_scripts/inline.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
