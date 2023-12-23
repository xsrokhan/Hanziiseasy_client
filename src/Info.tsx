import React from 'react'

const Info = () => {
  return (
    <div className="info">
      <div>
        <p>This app is meant for Chinese character and tone practice, as well as better word memorization. Discovering shared characters between words enhances
        character recognition and leads to a more effective word retention.</p>
        <p>The app includes 2500 most common characters, which by default are sorted from the most to the least common. Both characters and words can be
          reversed or randomized. The words containing the selected character are sorted by the aggregate amount of the frequency indices of all of the contained characters.
          </p>
          <p>
            If tone frequency is on, tones need to be indicated after each syllable using numbers from 1 to 5. 1 represents the <i>neutral</i> tone. 2 represents 
            the <i>rising</i> tone. 3 represents the <i>falling-rising</i> tone, and 4 represents the <i>falling</i> tone. If there is no tone, number 5 should be placed after the
            syllable. So for example, <b>shìde</b> should be written as <b>shi4de5</b>. If tone sensitivity is off, tones don't need to be indicated, so the same word would
            be written simply as <b>shide</b>. If a vowel has an umlaut, as in the word <b>nǚ</b>, a colon needs to be put before the number like so: <b>nu:3</b>
            </p>
            <p>Words are given in batches of 5. Most surnames, names of brands and other proper nouns have been removed from the dictionary, since common nouns are more useful.</p>    
      </div>
    </div>
  )
}

export default Info