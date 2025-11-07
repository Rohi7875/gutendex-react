# Gutendex API Documentation

## 📡 Base URL
```
http://skunkworks.ignitesol.com:8000
```

## 🔗 Endpoints

### GET /books
Retrieves a list of books from the Gutendex database.

---

## 📋 Response Format

```json
{
  "count": 67854,
  "next": "http://skunkworks.ignitesol.com:8000/books?page=2",
  "previous": null,
  "results": [
    {
      "id": 84,
      "title": "Frankenstein; Or, The Modern Prometheus",
      "authors": [
        {
          "name": "Shelley, Mary Wollstonecraft",
          "birth_year": 1797,
          "death_year": 1851
        }
      ],
      "translators": [],
      "subjects": [
        "Frankenstein's monster (Fictitious character) -- Fiction",
        "Frankenstein, Victor (Fictitious character) -- Fiction",
        "Gothic fiction",
        "Horror tales",
        "Monsters -- Fiction",
        "Science fiction",
        "Scientists -- Fiction"
      ],
      "bookshelves": [
        "Gothic Fiction",
        "Movie Books",
        "Precursors of Science Fiction",
        "Science Fiction by Women"
      ],
      "languages": ["en"],
      "copyright": false,
      "media_type": "Text",
      "formats": {
        "application/epub+zip": "https://www.gutenberg.org/ebooks/84.epub.images",
        "application/x-mobipocket-ebook": "https://www.gutenberg.org/ebooks/84.kindle.images",
        "text/html": "https://www.gutenberg.org/ebooks/84.html.images",
        "application/octet-stream": "https://www.gutenberg.org/files/84/84-0.zip",
        "text/plain; charset=utf-8": "https://www.gutenberg.org/files/84/84-0.txt",
        "text/plain": "https://www.gutenberg.org/ebooks/84.txt.utf-8",
        "application/rdf+xml": "https://www.gutenberg.org/ebooks/84.rdf",
        "image/jpeg": "https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg",
        "application/pdf": "https://www.gutenberg.org/files/84/84-pdf.pdf"
      },
      "download_count": 58910
    }
    // ... more books
  ]
}
```

---

## 🔍 Query Parameters

### Required Parameters (for our use case)

#### `mime_type`
Filter books by MIME type of their formats.

**Our Usage:**
```
mime_type=image/
```
This ensures we only get books that have cover images.

**How it works:**
- Gutendex returns books where ANY format starts with the specified MIME type
- `image/` matches `image/jpeg`, `image/png`, etc.
- This guarantees every book has a cover image

---

### Optional Parameters

#### `topic`
Search for books by subject or bookshelf (case-insensitive).

**Examples:**
```
topic=fiction
topic=drama
topic=philosophy
```

**Usage in App:**
```javascript
const category = 'FICTION'
const url = `${BASE_URL}/books?mime_type=image/&topic=${category}`
```

**Note:** Searches both `subjects` and `bookshelves` fields in the book data.

---

#### `search`
Search books by title or author name (case-insensitive).

**Examples:**
```
search=vampire
search=shakespeare
search=war%20and%20peace
```

**Usage in App:**
```javascript
const searchTerm = 'vampire'
const url = `${BASE_URL}/books?mime_type=image/&topic=FICTION&search=${encodeURIComponent(searchTerm)}`
```

**Important:** 
- Must be URL-encoded
- Searches both title AND author fields
- Space should be `%20` or `+`

---

#### `languages`
Filter by language codes (comma-separated).

**Example:**
```
languages=en
languages=fr,es
```

**Default in App:** Not used (shows all languages)

---

#### `ids`
Get specific books by ID (comma-separated).

**Example:**
```
ids=84,1342,11
```

**Usage:** For fetching specific known books.

---

## 📄 Pagination

### How it Works
- Returns up to **32 books per page**
- `next` field contains URL for next page
- `previous` field contains URL for previous page
- `count` field shows total books matching query

### Example Flow
```
Page 1: GET /books?mime_type=image/&topic=FICTION
Response: { count: 1234, next: "/books?page=2&...", results: [...32 books] }

Page 2: GET /books?page=2&mime_type=image/&topic=FICTION
Response: { count: 1234, next: "/books?page=3&...", results: [...32 books] }
```

### Implementation in App
```javascript
// Initial load
const url = `${BASE}/books?mime_type=image/&topic=FICTION`
const res = await fetch(url)
const data = await res.json()
setBooks(data.results)
setNext(data.next)

// Load more (infinite scroll)
if (next) {
  const res = await fetch(next)
  const data = await res.json()
  setBooks(prev => [...prev, ...data.results])
  setNext(data.next)
}
```

---

## 📚 Book Object Structure

### Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique Project Gutenberg ID |
| `title` | string | Book title |
| `authors` | array | Array of author objects |
| `subjects` | array | Subject classifications |
| `bookshelves` | array | Gutenberg bookshelf categories |
| `languages` | array | Language codes (e.g., ["en"]) |
| `formats` | object | URLs to different formats |
| `download_count` | number | Popularity metric |

### Formats Object

The `formats` object contains URLs for different file types:

```json
{
  "text/html": "https://www.gutenberg.org/ebooks/84.html.images",
  "application/pdf": "https://www.gutenberg.org/files/84/84-pdf.pdf",
  "text/plain; charset=utf-8": "https://www.gutenberg.org/files/84/84-0.txt",
  "image/jpeg": "https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg",
  "application/epub+zip": "https://www.gutenberg.org/ebooks/84.epub.images"
}
```

**Important:** 
- ZIP files should be excluded from viewable formats
- Images are cover images, not viewable book content

---

## 🎯 Our Query Strategy

### 1. Category Browse
```
GET /books?mime_type=image/&topic=FICTION
```
- Returns all Fiction books with covers
- Ordered by download count (popularity)
- Max 32 per page

### 2. Category + Search
```
GET /books?mime_type=image/&topic=FICTION&search=vampire
```
- Returns Fiction books matching "vampire"
- Searches title and author
- Still only books with covers

### 3. Pagination
```
GET /books?mime_type=image/&topic=FICTION&page=2
```
- Next page of results
- Same filters applied

---

## 🔨 Implementation Details

### Building URLs

```javascript
const buildUrl = (category, searchTerm = '') => {
  const params = new URLSearchParams()
  params.set('mime_type', 'image/')
  if (category) params.set('topic', category)
  if (searchTerm) params.set('search', searchTerm)
  return `${BASE_URL}/books?${params.toString()}`
}
```

### Filtering Viewable Formats

```javascript
const getViewableFormat = (formats) => {
  const entries = Object.entries(formats)
    .filter(([mime, url]) => 
      url && 
      !mime.includes('zip') && 
      !mime.startsWith('image/')
    )
  
  // Priority: HTML > PDF > TXT
  const html = entries.find(([m]) => m.includes('text/html'))
  if (html) return html[1]
  
  const pdf = entries.find(([m]) => m.includes('pdf'))
  if (pdf) return pdf[1]
  
  const txt = entries.find(([m]) => m.includes('text/plain'))
  if (txt) return txt[1]
  
  return null
}
```

### Getting Cover Image

```javascript
const getCoverImage = (formats) => {
  return formats['image/jpeg'] || 
         formats['image/png'] || 
         ''
}
```

---

## ⚠️ Important Notes

### MIME Type Filter
- **Always include** `mime_type=image/` to get only books with covers
- Without this, many books won't have cover images
- This is a **workaround** for the "books with covers only" requirement

### ZIP Files
- ZIP files contain book content but aren't viewable in browser
- Always filter out formats containing "zip"
- Example: `application/octet-stream` with `.zip` extension

### Format Priority
Per requirements:
1. **HTML** - Best for web viewing
2. **PDF** - Good alternative
3. **TXT** - Fallback option
4. **Alert** - If none available

### Pagination
- Don't make multiple simultaneous requests
- Use `next` URL as-is (don't modify)
- Check if `next` is null (no more pages)

---

## 🧪 Testing API Calls

### Using Browser
```
http://skunkworks.ignitesol.com:8000/books?mime_type=image/&topic=FICTION
```

### Using cURL
```bash
curl "http://skunkworks.ignitesol.com:8000/books?mime_type=image/&topic=FICTION"
```

### Using JavaScript Console
```javascript
fetch('http://skunkworks.ignitesol.com:8000/books?mime_type=image/&topic=FICTION')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 📊 Expected Response Times

| Operation | Expected Time |
|-----------|---------------|
| Initial Load | < 500ms |
| Search | < 800ms |
| Pagination | < 500ms |

---

## 🐛 Common Issues

### 1. CORS Errors
**Symptom:** API calls fail with CORS error  
**Solution:** API server must have CORS headers enabled

### 2. No Books Returned
**Check:** 
- Is `mime_type=image/` included?
- Is the topic spelled correctly?
- Are there books matching that topic?

### 3. Images Not Loading
**Check:**
- Book has `image/jpeg` or `image/png` in formats
- Image URL is accessible
- CORS allows image loading

---

## 📚 Categories Used in App

```javascript
const CATEGORIES = [
  'FICTION',
  'DRAMA',
  'HUMOUR',
  'POLITICS',
  'PHILOSOPHY',
  'HISTORY',
  'ADVENTURE',
  'CHILDREN',
  'POETRY',
  'ROMANCE'
]
```

---

**API Documentation Complete** ✅

