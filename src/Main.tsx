import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import InfoModal from './InfoModal'

interface CharacterAndWord {
  simplified: string,
  pinyin: string,
  english: Array<string>,
}

const Main = (props: {chars: Array<CharacterAndWord>}) => {
  let { chars } = props
  
  // Range states
  const [lowerRange, setLowerRange] = useState(1)
  const [upperRange, setUpperRange] = useState(2500)
  const [displayedLowerRange, setDisplayedLowerRange] = useState("")
  const [displayedUpperRange, setDisplayedUpperRange] = useState("")
  const [lowerRangeForCt, setLowerRangeForCt] = useState(lowerRange)
  const [upperRangeForCt, setUpperRangeForCt] = useState(upperRange)
  const [confirmRange, setConfirmRange] = useState(1)
  const [confirmRangeActive, setConfirmRangeActive] = useState(false)
  
  // Current character and word number states
  const [charNumber, setCharNumber] = useState(1)
  const [wordNumber, setWordNumber] = useState(1)

  // Word count state
  const [wordCt, setWordCt] = useState(1)

  // Answer states
  const [answer, setAnswer] = useState("")
  const [rightAnswer, setRightAnswer] = useState(false)
  const [wrongAnswer, setWrongAnswer] = useState(false)
  
  
  const [dropDownVisible, setDropdownVisible] = useState(false) // dropdown for Reset button
  const [increment, setIncrement] = useState(0) // incremented by 5 with each batch


  // Settings states
  const [toneSensitivity, setToneSensitivity] = useState(true)
  const [randomize, setRandomize] = useState(false)
  const [randomizeHanzi, setRandomizeHanzi] = useState(false)
  const [randomizeWords, setRandomizeWords] = useState(false)
  const [reverse, setReverse] = useState(false)
  const [reverseHanzi, setReverseHanzi] = useState(false)
  const [reverseWords, setReverseWords] = useState(false)

  // Character search states
  const [searchVal, setSearchVal] = useState("")
  const [hanziNotFound, setHanziNotFound] = useState(false)
  
  // Current range of characters and words states
  const [currentROF, setCurrentROF] = useState(chars)
  const [words, setWords] = useState(Array<CharacterAndWord>)
  
  // Modal states
  const [hanziInfoModal, setHanziInfoModal] = useState(false)
  const [wordInfoModal, setWordInfoModal] = useState(false)
  const [wordListModal, setWordListModal] = useState(false)
  const [hideTranslations, setHideTranslations] = useState({})
  const [modalExitAnim, setModalExitAnim] = useState(false)
  
  // Loading state for debouncing (used in API call)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (chars.length) {
      let timeoutId: any
      clearTimeout(timeoutId)
      setIsLoading(true)
      timeoutId = setTimeout(() => {
        Axios.get(`https://hanziiseasyserver-production.up.railway.app/search_dict/${currentROF[charNumber - 1]["simplified"]}`).then(res => {setWords(reverseWords ? reverseArray(res.data) : randomizeWords ? randomizeArray(res.data) : res.data); setHideTranslations(createWordListModalTrState(res.data.length)); setIsLoading(false)})
        reset("all words")
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [charNumber, currentROF, reverseWords, randomizeWords])

  useEffect(() => {
      setConfirmRangeActive(true)
  }, [lowerRange, upperRange])
  
  useEffect(() => {
    setCurrentROF(reverseHanzi ? reverseArray(chars.slice(lowerRange - 1, upperRange)) : randomizeHanzi ? randomizeArray(chars.slice(lowerRange - 1, upperRange)) : chars.slice(lowerRange - 1, upperRange))
  }, [chars, reverseHanzi, randomizeHanzi])

  useEffect(() => {
    setConfirmRangeActive(false)
  }, [confirmRange])

  useEffect(() => {
    if (!randomizeHanzi && !randomizeWords) {
      setRandomize(false)
    } else {
      setRandomize(true)
    }
    if (!reverseHanzi && !reverseWords) {
      setReverse(false)
    } else {
      setReverse(true)
    }
    setDropdownVisible(false)
  }, [randomizeHanzi, randomizeWords, reverseHanzi, reverseWords])

  function createWordListModalTrState(arg: number) {
    let res: { [key: string]: any } = {}
    for (let i = 1; i <= arg; i++) {
      res[i] = true;
    }
    return res
  }

  function changeLowerRange(e: React.ChangeEvent<HTMLInputElement>) {
    let val: String = (e.target as HTMLInputElement).value
    if (!val || val === "0") {
      setLowerRange(1)
      setDisplayedLowerRange("")
    } else if (+val > upperRange) {
      setLowerRange(upperRange)
      setDisplayedLowerRange("" + upperRange)
    } else {
      setLowerRange(+val)
      setDisplayedLowerRange("" + val)
    }
  }

  function changeUpperRange(e: React.ChangeEvent<HTMLInputElement>) {
    let val: String | undefined = e.target.value
    if (!val) {
      setUpperRange(2500)
      setDisplayedUpperRange("")
    } else {
      setUpperRange(+val)
      setDisplayedUpperRange("" + val)
    }
  }

  function answerHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (hanziNotFound) {
      setAnswer("")
      setHanziNotFound(false)
    } else {
      let val: string = e.target.value
      setAnswer(val)
      setSearchVal(val)
    }
  }

  function answerChecker() {
    let processedVal = answer.trim().split(" ").join("").toLowerCase()
    let processedPinyin = words.slice(increment, 5 + increment)[wordNumber - 1]["pinyin"].split(" ").join("").toLowerCase()
    processedPinyin = !toneSensitivity ? processedPinyin.replace(/[\d:]+/g, "") : processedPinyin 
    if (processedVal === processedPinyin) {
      setRightAnswer(true)
    } else {
      setWrongAnswer(true)
    }
  }
    
  function pinyinConverter(arg: string) {
    const regex = /[aeiou]/ig
    let obj: any = {
      "a": {
        "1": "ā",
        "2": "á",
        "3": "ǎ",
        "4": "à",
        "5": "a"
      },
      "e": {
        "1": "ē",
        "2": "é",
        "3": "ě",
        "4": "è",
        "5": "e"
      },
      "i": {
        "1": "ī",
        "2": "í",
        "3": "ǐ",
        "4": "ì",
        "5": "i"
      },
      "o": {
        "1": "ō",
        "2": "ó",
        "3": "ǒ",
        "4": "ò",
        "5": "o"
      },
      "u": {
        "1": "ū",
        "2": "ú",
        "3": "ǔ",
        "4": "ù",
        "5": "u"
      },
      "A": {
        "1": "Ā",
        "2": "Á",
        "3": "Ǎ",
        "4": "À",
        "5": "A"
      },
      "E": {
        "1": "Ē",
        "2": "É",
        "3": "Ě",
        "4": "È",
        "5": "E"
      },
      "I": {
        "1": "Ī",
        "2": "Í",
        "3": "Ǐ",
        "4": "Ì",
        "5": "I"
      },
      "O": {
        "1": "Ō",
        "2": "Ó",
        "3": "Ǒ",
        "4": "Ò",
        "5": "O"
      },
      "U": {
        "1": "Ū",
        "2": "Ú",
        "3": "Ǔ",
        "4": "Ù",
        "5": "U"
      }
    }
    let converted: any = arg.split(" ")
    //console.log("converted", converted)
    converted.forEach((word: any, i: number) => {
      if (+word[word.length - 1] && word.length !== 2) { // process only pinyin and only non-single chars
        if (word[word.length - 2] === ":" || word[word.length - 3] === ":") { // if contains ü
          if (word === "nu:3") converted[i] = "nǚ"
          else if (word === "lu:2") converted[i] = "lǘ"
          else if (word === "lu:3") converted[i] = "lǚ"
          else if (word === "lu:4") converted[i] = "lǜ"
          else if (word === "lu:e4") converted[i] = "lüè"
        } else { // most cases
          regex.lastIndex = 0;
          let endsWithAVowel = regex.test(word[word.length - 2])
          regex.lastIndex = 0;
          let penultimateIsAVowel = regex.test(word[word.length - 3])
          let replaceMiddle = ((word.slice(1, 3) === "ao" || word.slice(1, 3) === "ai" || word.slice(1, 3) === "ei" || word.slice(1, 3) === "ou" || !endsWithAVowel) && word.length === 4) || (word.length === 5 && !penultimateIsAVowel) || word.length === 3
          let idxToReplace = replaceMiddle ? 1 : 2
          idxToReplace = ((word.length === 6 && penultimateIsAVowel) || word.length === 7) ? 3 : (word.length === 6 && !penultimateIsAVowel) ? 2 : idxToReplace // e.g. zhong4, zhuang4
          idxToReplace = word.slice(word.length - 3, word.length - 1) === "ui" ? (word.length === 4 ? 2 : 3) : idxToReplace // e.g. gui1, zhui1
          idxToReplace = word.length === 5 && (word.slice(2, 4) === "uo" || word.slice(2, 4) === "ua") ? 3 : idxToReplace // e.g. zhuo2, zhua1
          regex.lastIndex = 0;
          if ((word.length === 3 && regex.test(word[0])) || (word.length === 4 && regex.test(word[0]))) idxToReplace = 0 // e.g. er4, ang4
          let replacement = obj[word[idxToReplace]][word[word.length - 1]]
          converted[i] = converted[i].split("")
          converted[i].pop()
          converted[i][idxToReplace] = replacement
          converted[i] = converted[i].join("")
        }
      } else { // e.g. e4, r5, etc.
        let isAVowel = regex.test(word[0])
        let replacement = isAVowel ? obj[word[0]][word[1]] : word[0]
        converted[i] = replacement
      }
    })
    return converted.join(" ")
  }

  function pinyinProcessor(arg: string) {
    let arr = arg.split(" ")
    return arr.reduce((acc, val) => {
      acc = val[0] === val[0].toLowerCase() ? acc + val : acc + " " + val
      return acc
    })
  }

  function reset(arg: string) {
    if (arg === "batch") {
      setWordNumber(1)
      setWordCt(increment + 1)
      setAnswer("")
      setRightAnswer(false)
    }
    if (arg === "all words" || arg === "next hanzi" || arg === "prev hanzi") {
      setWordNumber(1)
      setWordCt(1)
      setAnswer("")
      setRightAnswer(false)
      setIncrement(0)
    }
  }

  function handleReverse(arg: string) {
    if (arg === "hanzi") {
      setReverseHanzi(prev => !prev)
      setCharNumber(1) 
      if (randomizeHanzi) setRandomizeHanzi(false)
    }
    if (arg === "words") {
      setReverseWords(prev => !prev)
      setWordNumber(1)
      if (randomizeWords) setRandomizeWords(false)
    }
  }

  function handleRandomize(arg: string) {
    if (arg === "hanzi") {
      setRandomizeHanzi(prev => !prev)
      setCharNumber(1)
      if (reverseHanzi) setReverseHanzi(false)
    }
    if (arg === "words") {
      setRandomizeWords(prev => !prev)
      setWordNumber(1)
      if (reverseWords) setReverseWords(false)
    }
  }

  function reverseArray(arr: Array<CharacterAndWord>) {
    let reversed = []
    for (let i = arr.length - 1; i >= 0; i--) {
      reversed.push(arr[i])
    }
    return reversed
  }
  
  function randomizeArray(arr: Array<CharacterAndWord>) {
    return arr.map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value)
  }
  
  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      let idx = chars.findIndex(char => char.simplified === searchVal)
      if (idx === -1) {
        setHanziNotFound(true)
        setSearchVal("")
        setAnswer("Hanzi not found...")
      } else {
        reset("all words")
        setReverseHanzi(false)
        setRandomizeHanzi(false)
        setReverseWords(false)
        setRandomizeWords(false)
        setLowerRange(1)
        setUpperRange(2500)
        setDisplayedLowerRange("")
        setDisplayedUpperRange("")
        setCurrentROF(chars.slice(0, 2500))
        setCharNumber(idx + 1)
      }
    }
  }

  function handleCloseModal() {
      setModalExitAnim(true)
      setTimeout(() => {
        setHanziInfoModal(false)
        setWordInfoModal(false)
        setWordListModal(false)
        setModalExitAnim(false)
      }, 500)
  }

  function findRankOfChar(arg: string) {
    return chars.findIndex(char => char["simplified"] === arg) + 1
  }

  function handleHideModalTranslations(event: React.MouseEvent<HTMLDivElement>) {
    const selected = (event.target as HTMLElement).classList.value
    setHideTranslations({...hideTranslations, [selected]: !hideTranslations[selected as keyof typeof hideTranslations]})
  }
  
  return (
    <div className="main">
      {currentROF.length !== 0 ?
        <>
          <div className="range">
            <button data-disabled={confirmRangeActive ? "false" : "true"} onClick={(() => { setConfirmRange(prev => prev + 1); setCurrentROF(reverseHanzi ? reverseArray(chars).slice(lowerRange - 1, upperRange < lowerRange ? lowerRange : upperRange) : randomizeHanzi ? randomizeArray(chars).slice(lowerRange - 1, upperRange < lowerRange ? lowerRange : upperRange) : chars.slice(lowerRange - 1, upperRange < lowerRange ? lowerRange : upperRange)); setUpperRange(prev => prev < lowerRange ? lowerRange : prev); setDisplayedUpperRange(prev => upperRange < lowerRange ? "" + lowerRange : prev); setLowerRangeForCt(lowerRange); setUpperRangeForCt(upperRange < lowerRange ? lowerRange : upperRange); setCharNumber(1) })}>Apply range</button>
            <div className="rangeVals">
              <input type="number" placeholder='1' onChange={changeLowerRange} value={displayedLowerRange} />
              <div>&mdash;</div>
              <input type="number" placeholder='2500' onChange={changeUpperRange} value={displayedUpperRange} />
            </div>
          </div>
          <div className="charContainer">
            <i className="fa-solid fa-chevron-left" onClick={() => { setCharNumber(prev => prev - 1); reset("next hanzi") }} style={{ opacity: charNumber === 1 ? "0.5" : "1", pointerEvents: charNumber === 1 ? "none" : "auto" }}></i>
            <div className="char">
              <div className="hanzi">
                <i className="fa-solid fa-list" onClick={() => setWordListModal(true)}></i>
                {currentROF[charNumber - 1]["simplified"]}
                <div className="char_ct">{charNumber}/{upperRangeForCt - lowerRangeForCt + 1}</div>
              </div>
              <div className="pinyin">
                {pinyinConverter(currentROF[charNumber - 1]["pinyin"])}
              </div>
              <div className="pinyin_translation">
                <div>
                  {currentROF[charNumber - 1]["english"][0]}
                </div>
                <svg onClick={() => setHanziInfoModal(true)} xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50"><path fill="#5072A7" d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"/></svg>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right" onClick={() => { setCharNumber(prev => prev + 1); reset("prev hanzi") }} style={{ opacity: charNumber === currentROF.length ? "0.5" : "1", pointerEvents: charNumber === currentROF.length ? "none" : "auto" }}></i>
          </div>
        <div className="wordContainer">
          {words.length !== 0 ?
            <>
              <div>
                <div className="hanzi">{!isLoading ? words.slice(increment, 5 + increment)[wordNumber - 1]["simplified"] : <i className="fas fa-spinner fa-spin"></i>}</div>
                <div className="hanzi_ct">{wordCt} / {words.length}</div>
              </div>
              <div className="pinyin">{rightAnswer ? pinyinProcessor(pinyinConverter(words.slice(increment, 5 + increment)[wordNumber - 1]["pinyin"])) : "?".repeat(words[wordNumber - 1]["simplified"].length)}</div>
              <div className="word_translation">
                <div>
                  {words.slice(increment, 5 + increment)[wordNumber - 1]["english"][0]}
                </div>
                <svg onClick={() => setWordInfoModal(true)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path fill="#5072A7" d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z" /></svg>
              </div>
              <input type="text" onChange={answerHandler} onKeyDown={handleSearch} value={answer} className={`${wrongAnswer ? "shaking_inp" : ""}`} onAnimationEnd={() => setWrongAnswer(false)} placeholder='Write your answer...'/>
              <div className="word_controls">
                <div className="resetContainer" style={{ opacity: wordNumber > 1 || increment > 0 ? "1" : "0.5", pointerEvents: wordNumber > 1 || increment > 0 ? "auto" : "none" }}>
                  <span onClick={() => { setDropdownVisible(prev => !prev) }}>Reset</span>
                  <span onClick={() => { setDropdownVisible(prev => !prev) }}>
                    <i className={`fa-solid fa-caret-down ${dropDownVisible ? 'arrowUp' : ''}`}></i>
                  </span>
                  <ul style={dropDownVisible ? { opacity: 1, visibility: "visible" } : { opacity: 0, visibility: "hidden" }}>
                    <li onClick={() => { reset("batch"); setDropdownVisible(prev => !prev) }}>current batch</li>
                    <li onClick={() => { reset("all words"); setDropdownVisible(prev => !prev) }}>all words</li>
                  </ul>
                </div>
                <button onClick={answerChecker}>{rightAnswer ? <i className="fa-solid fa-check"></i> : "Check"}</button>
                {wordNumber < 5 ?
                  <button style={{ opacity: increment + wordNumber >= words.length ? "0.5" : "1", pointerEvents: increment + wordNumber > words.length ? "none" : "auto" }} onClick={(() => { setWordNumber(prev => prev + 1); setWordCt(prev => prev + 1); setRightAnswer(false); setAnswer("") })}>{rightAnswer ? "Next" : "Skip"}</button> :
                  <button style={{ opacity: words.slice(increment + 5, increment + 10).length ? "1" : "0.5", pointerEvents: words.slice(increment + 5, increment + 10).length ? "auto" : "none" }} onClick={() => { setIncrement(prev => prev + 5); setWordNumber(1); setWordCt(prev => prev + 1); setRightAnswer(false); setAnswer("")}}>Next batch</button>}
              </div>
            </> : <i className="fas fa-spinner fa-spin"></i>}
        </div>
        </> : <i className="fas fa-spinner fa-spin main_spinner"></i>}
      {words.length !== 0 &&
        <div className="settingsContainer">
          <div className="tone_s_container">
            <div style={{fontWeight: "500"}}>
              Tone sensitivity
            </div>
            <div className="switchContainer" onClick={() => setToneSensitivity(prev => !prev)}>
              <div className={`switch ${toneSensitivity ? "on" : "off"}`} style={{ opacity: toneSensitivity ? "1" : "0.5" }}></div>
            </div>
          </div>
          <div className="reverseContainer">
            <div style={{fontWeight: "500"}}>Reverse</div>
            <div className="reverseOptions">
              <div style={{ opacity: !reverse ? "1" : "0.5", pointerEvents: !reverse ? "none" : "auto" }} onClick={() => { setReverseHanzi(false); setReverseWords(false); setCharNumber(1); setWordNumber(1) }} >
                Off
              </div>
              <div style={{ opacity: reverseHanzi ? "1" : "0.5" }} onClick={() => handleReverse("hanzi")}>
                Hanzi
              </div>
              <div style={{ opacity: reverseWords ? "1" : "0.5" }} onClick={() => handleReverse("words")}>
                Words
              </div>
            </div>
          </div>
          <div className="randomizeContainer">
            <div style={{fontWeight: "500"}}>Randomize</div>
            <div className="randomizeOptions">
              <div style={{ opacity: !randomize ? "1" : "0.5", pointerEvents: !randomize ? "none" : "auto" }} onClick={() => { setRandomizeHanzi(false); setRandomizeWords(false); setCharNumber(1); setWordNumber(1) }}>
                Off
              </div>
              <div style={{ opacity: randomizeHanzi ? "1" : "0.5" }} onClick={() => handleRandomize("hanzi")}>
                Hanzi
              </div>
              <div style={{ opacity: randomizeWords ? "1" : "0.5" }} onClick={() => handleRandomize("words")}>
                Words
              </div>
            </div>
          </div>
        </div>}
      {currentROF.length !== 0 && words.length !== 0 && 
        <InfoModal open={hanziInfoModal || wordInfoModal || wordListModal} close={() => handleCloseModal()} closeAnimation={modalExitAnim}>
          {hanziInfoModal ?
            <div className="modal_translations_container">
              <div className="modal_char">{currentROF[charNumber - 1]["simplified"]}</div>
              <div className="modal_pinyin">{pinyinConverter(currentROF[charNumber - 1]["pinyin"])}</div>
              <div className="modal_rank">Rank: {findRankOfChar(currentROF[charNumber - 1]["simplified"])}</div>
              <ol className="modal_translations_list">
                {currentROF[charNumber - 1]["english"].map((translation, i) => (
                  <li key={i}>{translation}</li>
                ))}
              </ol>
              </div> : wordInfoModal ? 
            <div className="modal_translations_container">
              <div className="modal_char">{words.slice(increment, 5 + increment)[wordNumber - 1]["simplified"]}</div>
              <div className="modal_pinyin">{pinyinProcessor(pinyinConverter(words.slice(increment, 5 + increment)[wordNumber - 1]["pinyin"]))}</div>
              <ol className="modal_translations_list">
                {words.slice(increment, 5 + increment)[wordNumber - 1]["english"].map((translation, i) => (
                  <li key={i}>{translation}</li>
                ))}
              </ol>
            </div> : 
            <>
            <div className="modal_all_words_container">
                {words.map((w, i) => (
                  <div className="modal_all_words_individual_container" key={i}>
                    <div className="modal_all_words_char">{w["simplified"]}</div>
                    <div>{pinyinProcessor(pinyinConverter(w["pinyin"]))}</div>
                    <div className={`${(i + 1) + ""}`} onClick={handleHideModalTranslations}>Translation</div>
                    <div className="modal_all_words_tr" aria-hidden={hideTranslations[(i + 1) + "" as keyof typeof hideTranslations]}>
                      <div>
                        <ol >
                          {w["english"].map((translation, j) => (
                            <li key={j}>{translation}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
            </>
          }
        </InfoModal>}
    </div>
  )
}


export default Main



