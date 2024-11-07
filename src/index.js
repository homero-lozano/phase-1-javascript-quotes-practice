fetch('http://localhost:3000/quotes?_embed=likes')
  .then(response => response.json())
  .then(quotes => {
    quotes.forEach(quote => renderQuote(quote));
  });
  function renderQuote(quote) {
    const quoteList = document.getElementById('quote-list');
    const quoteItem = document.createElement('li');
    quoteItem.classList.add('quote-card');
    quoteItem.setAttribute('data-id', quote.id); // Add data-id attribute for easier targeting
  
    const likesCount = quote.likes ? quote.likes.length : 0;
  
    quoteItem.innerHTML = `
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${likesCount}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    `;
  
    quoteList.appendChild(quoteItem);
  
    // Add event listeners for like and delete buttons
    quoteItem.querySelector('.btn-success').addEventListener('click', () => likeQuote(quote));
    quoteItem.querySelector('.btn-danger').addEventListener('click', () => deleteQuote(quote, quoteItem));
  }
  
  document.getElementById('new-quote-form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const newQuote = event.target.quote.value;
    const newAuthor = event.target.author.value;
  
    fetch('http://localhost:3000/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quote: newQuote,
        author: newAuthor
      })
    })
      .then(response => response.json())
      .then(quote => renderQuote(quote));
  
    event.target.reset();
  });
  function deleteQuote(quote, quoteItem) {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
      method: 'DELETE'
    })
    .then(() => quoteItem.remove());
  }
  function likeQuote(quote) {
    fetch('http://localhost:3000/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteId: quote.id,
        createdAt: Math.floor(Date.now() / 1000) // UNIX timestamp
      })
    })
    .then(response => response.json())
    .then(() => {
      // Find the specific quote item by using the quote ID
      const quoteItem = document.querySelector(`.quote-card[data-id='${quote.id}']`);
      if (quoteItem) {
        const likeButton = quoteItem.querySelector('.btn-success span');
        const likesCount = parseInt(likeButton.innerText) + 1;
        likeButton.innerText = likesCount;
      } else {
        console.error(`Quote with ID ${quote.id} not found in the DOM.`);
      }
    });
  }
  
  