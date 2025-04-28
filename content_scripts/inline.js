(() => {

  if (window.hasRun) {
    return;
  }
  window.hasRun = true;


  const darkStyle='body {\
    color: rgba(255, 255, 255, 0.81);\
    background-color: #191919;\
    height:100%;\
    padding-left: 5%;\
    padding-right: 5%;\
  }';

  const lightStyle='body {\
    height:100%;\
    padding-left: 5%;\
    padding-right: 5%;\
  }';


  function clickElements(selector){ 
    document.querySelectorAll(selector).forEach(function(element){ element.click(); }); 
  }

  function expand() {
    clickElements("div[role='button'][tabindex='0'][aria-label='Open'][aria-expanded='false']");
  }

  function collapse() {
    clickElements("div[role='button'][tabindex='0'][aria-label='Close'][aria-expanded='true']");
  }


  function save(){
    
    // helper funciotn
    function decorateHtml(html){

      let style = 'html {\
        margin: auto;\
        -ms-text-size-adjust:100%;\
        -webkit-text-size-adjust:100%;\
        font-family:sans-serif\
       }';
      const colorStyle = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? darkStyle : lightStyle; 
      style = style + colorStyle;
      
      const start='<html lang="en"><head lang="en"><style>' + style + '</style><meta charset="utf-8" content="text/html"></head><body>';  
      const end='</body></html>';

      return start + html + end;
    }

    // prepare
    const a = document.createElement("a");
    a.style = "display: none";
    document.body.appendChild(a);

    // filename
    const fileExt = ".html"
    const filename = document.title + fileExt;
    a.download = filename;

    // content
    const selector = "div.notion-page-content";
    const el = document.querySelector(selector);
    const htmlData = decorateHtml(el.outerHTML);
    const file = new Blob([htmlData]);

    // download
    a.href = URL.createObjectURL(file);
    a.click();
    window.URL.revokeObjectURL(file);
    a.remove();
  }


  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "expand") {
      expand();
    } else if (message.command === "collapse") {
      collapse();
    } else if (message.command === "save") {
      save();
    }
  });

})();

