const phase = "Let the hacking begin!!!"
const tag = document.getElementById("quote")


// bom bom parameters
const bomAmount = 5;
const bomTime = 500;

/* this rulse must hold:
  str.length * charPrintTime <= strPrintTime
  */
const charPrintTime = 100;
const strPrintTime = phase.length * 100 + 2 * bomTime * bomAmount + 4000;


const bufferSpace = createSpace(phase.length); 

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// create given amount of space
function createSpace(n) {
  let spaces = ""
  for (let i = 0; i < n; i++)
    spaces += "x"
  return spaces
}

// shuffle the pahses chars
function shuffleChars() {
  let chrArray = phase.split('');
  for (let i = 0; i < chrArray.length; i++) { 
    let rand = Math.floor(Math.random() * chrArray.length);
    const temp = chrArray[i]; 
    chrArray[i] = chrArray[rand] 
    chrArray[rand] = temp
  }
  return chrArray.join("")
}

// bom boms the completed text
async function bomBom(str) {
  tag.innerHTML = shuffleChars() 
  await sleep(bomTime)
  tag.innerHTML = phase;
}

// write chars each string
async function writeChar(str) {
  let buffer = ""
  for (let i = 0; i < str.length; i++) {
    buffer += str.substring(i, i+1)
    tag.innerHTML = buffer;
    await sleep(charPrintTime)
  }

  for (let i = 0; i < bomAmount; i++) {
    bomBom()
    await sleep(bomTime + 500)
  }
}


// run immediently on loading page
writeChar(phase);

/* loop to prit chars */
setInterval(function () {
  writeChar(phase)
}, strPrintTime)
