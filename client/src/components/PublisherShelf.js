import { AUTHOR_LINKS } from '../data/publishedBooks';
function PublisherShelf({ books }) {
  return (
    <section className="publisher-shelf" aria-label="Published books">
      <div className="publisher-shelf__header"><p>Published shelf</p><strong>{books.length} works</strong></div>
      <div className="publisher-shelf__books">
        {books.map((book,index)=><article key={book.title} style={{'--book-index':index}}>
          <a
            href={book.amazon}
            target="_blank"
            rel="noreferrer"
            aria-label={`Buy ${book.title} on Amazon`}
          >
            <span>{String(index+1).padStart(2,'0')}</span>
            <h3>{book.title}</h3>
            <p>{book.series}</p>
            <strong>View on Amazon <span aria-hidden="true">↗</span></strong>
          </a>
        </article>)}
      </div>
      <div className="publisher-shelf__links">
        <a href={AUTHOR_LINKS.amazon} target="_blank" rel="noreferrer">Amazon author page</a>
        <a href={AUTHOR_LINKS.goodreads} target="_blank" rel="noreferrer">Goodreads</a>
      </div>
    </section>
  );
}
export default PublisherShelf;
