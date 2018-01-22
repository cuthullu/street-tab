function setUp() {
  const TOP_SECRET = "L1G66Tfishy9aRMG7RPl1RMOX2DIV1aZ"
  const BASE_URL = "https://api.giphy.com/v1/gifs/search?api_key=L1G66Tfishy9aRMG7RPl1RMOX2DIV1aZ&limit=25&offset=0&rating=G&lang=en"
  const ENTER = "Enter"

  let gifIndex
  let gifCollection
  getSearchTextInput().addEventListener("keypress", createGiphyHandler())
  document.getElementById("giphySearchLeft").addEventListener("click", setPreviousGiphyImage)
  document.getElementById("giphySearchRight").addEventListener("click", setNextGiphyImage)
  document.getElementById("giphySearchClose").addEventListener("click", clearGiphy)
  getCopyButton().addEventListener("click", copyGifToClipboard)

  function copyGifToClipboard() {
    getGiphyTextArea().select()
    document.execCommand('copy')
    getCopyButton().focus()
  }

  function getCopyButton() {
    return document.getElementById("giphySearchLink")
  }

  function getSearchTextInput() {
    return document.getElementById("giphySearchText")
  }

  function getGiphyImageElement() {
    return document.getElementById("giphyImage")
  }

  function getGiphyTextArea() {
    return document.getElementById("giphyLinkText")
  }

  function clearGiphy() {
    gifIndex = undefined
    gifCollection = undefined
    getSearchTextInput().value = ""
    getGiphyImageElement().setAttribute("src", "")
  }

  function makeGiphyRequest(query) {
    if(query === "" || query === undefined) clearGiphy()
    const request = new XMLHttpRequest();
    const url = `${BASE_URL}&q=${query}`
    request.open("GET", url, true)
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status == 200) handleGiphyResponse(JSON.parse(request.responseText).data)
    }
    request.send()
  }

  function handleGiphyResponse(data) {
    gifCollection = data
    gifIndex = -1
    setNextGiphyImage()
  }

  function setNextGiphyImage() {
    if(!gifCollection) return 
    gifIndex = (gifIndex + 1) % gifCollection.length
    setGiphyImage()

  }

  function setPreviousGiphyImage() {
    if(!gifCollection) return 
    gifIndex = (gifIndex - 1) < 0 ? gifCollection.length - 1 : gifIndex - 1
    setGiphyImage()
  }

  function setGiphyImage() {
    const imageUrl = gifCollection[gifIndex].images.original.url
    getGiphyTextArea().value = imageUrl

    getGiphyImageElement().setAttribute("src", imageUrl)
  }

  function createGiphyHandler() {
    let storedValue = ""
    return ({ key, target: { value } }) => {
      if (key === ENTER) {
        if (storedValue !== value) {
          storedValue = value
          makeGiphyRequest(value)
        } else {
          setNextGiphyImage()
        }
      }
    }
  }

  function handleGiphyInput({ target: { value } }) {
    makeGiphyRequest(value)
  }

}

window.onload = setUp