# Testing Guide - Gutenberg Project

## 🧪 How to Test the Application

### Prerequisites
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the development server
3. Open `http://localhost:5173` in your browser

---

## ✅ Test Checklist

### 1. Home Page Tests

#### Visual Design
- [ ] Page has purple gradient background
- [ ] "Gutenberg Project" title is visible (48px, weight 600)
- [ ] Subtitle text is visible below title
- [ ] All 10 category buttons are displayed in a grid
- [ ] Each category has an icon (if available)
- [ ] Buttons have white background with shadow
- [ ] Hover effect works (button scales up slightly)

#### Category Buttons
- [ ] FICTION button works
- [ ] DRAMA button works
- [ ] HUMOUR button works
- [ ] POLITICS button works
- [ ] PHILOSOPHY button works
- [ ] HISTORY button works
- [ ] ADVENTURE button works
- [ ] CHILDREN button works
- [ ] POETRY button works
- [ ] ROMANCE button works

---

### 2. Category Page Tests

#### Navigation
- [ ] Clicking a category navigates to the category page
- [ ] Category name is displayed in header (H2, 30px)
- [ ] "Back" button is visible
- [ ] Clicking "Back" returns to home page
- [ ] Book count is displayed in header

#### API Integration
- [ ] Books load when page opens
- [ ] Only books with cover images are shown
- [ ] Books are displayed in a grid (2 columns on mobile, more on desktop)
- [ ] Loading indicator appears when fetching data

#### Book Display
- [ ] Each book shows a cover image (114x162px)
- [ ] Each book shows title
- [ ] Each book shows author name(s)
- [ ] Each book shows subjects (max 3)
- [ ] Book cards have white background with shadow
- [ ] Hover effect works on book cards

---

### 3. Infinite Scroll Tests

#### Basic Functionality
- [ ] Initial set of books loads (up to 32 books)
- [ ] Scrolling to bottom loads more books
- [ ] Loading indicator appears when fetching more books
- [ ] New books are appended to the list (not replacing)
- [ ] Scroll position is maintained after loading

#### Edge Cases
- [ ] Handles when there are no more books (next URL is null)
- [ ] Doesn't trigger multiple simultaneous loads
- [ ] Works smoothly without flickering

---

### 4. Search Functionality Tests

#### Basic Search
- [ ] Search input is visible at top of category page
- [ ] Placeholder text shows current category
- [ ] Typing in search box works
- [ ] Search icon is visible on left side
- [ ] Clear (X) button appears when typing
- [ ] Clicking clear button empties search

#### Search Behavior
- [ ] Search is debounced (waits 450ms after typing stops)
- [ ] Books are filtered by title AND author
- [ ] Search maintains category filter
- [ ] Book count updates based on search results
- [ ] "No books found" message appears if no results
- [ ] Loading indicator shows during search

#### Test Cases
- [ ] Search for "vampire" in FICTION category
- [ ] Search for "Shakespeare" in DRAMA category
- [ ] Search for "war" in HISTORY category
- [ ] Search for non-existent term (should show "No books found")
- [ ] Clear search returns to full category results

---

### 5. Book Opening Tests

#### Format Priority
- [ ] Clicking a book opens it in a new tab
- [ ] HTML format is preferred if available
- [ ] PDF format is used if no HTML
- [ ] TXT format is used if no HTML or PDF
- [ ] ZIP files are NOT opened

#### Error Handling
- [ ] Alert shows "No viewable version available" for books without viewable formats
- [ ] New tab/window opens correctly
- [ ] Original page stays open after opening book

#### Test Different Books
- [ ] Test a book with HTML format
- [ ] Test a book with only PDF format
- [ ] Test a book with only TXT format
- [ ] Test a book with no viewable formats

---

### 6. Responsive Design Tests

#### Desktop (1920px+)
- [ ] Categories display in 3-4 columns
- [ ] Books display in 5-6 columns
- [ ] Layout is centered with max-width
- [ ] All text is readable

#### Tablet (768px - 1024px)
- [ ] Categories display in 2-3 columns
- [ ] Books display in 3-4 columns
- [ ] Touch targets are large enough
- [ ] No horizontal scroll

#### Mobile (320px - 767px)
- [ ] Categories display in 2 columns
- [ ] Books display in 2 columns
- [ ] Text sizes are appropriate
- [ ] Buttons are easily tappable
- [ ] Search input is full width

---

### 7. Performance Tests

#### Load Times
- [ ] Initial page load is fast (< 2 seconds)
- [ ] Category page loads quickly
- [ ] Images load progressively (lazy loading)
- [ ] No significant lag when scrolling

#### Memory
- [ ] No memory leaks with infinite scroll
- [ ] Browser doesn't slow down after loading many books
- [ ] Navigation between pages is smooth

---

### 8. API Tests

#### Verify API Calls

Open browser DevTools (F12) → Network tab and check:

**Initial Category Load:**
```
URL: http://skunkworks.ignitesol.com:8000/books?mime_type=image/&topic=FICTION
Status: 200 OK
Response: JSON with books array
```

**Search Request:**
```
URL: http://skunkworks.ignitesol.com:8000/books?mime_type=image/&topic=FICTION&search=vampire
Status: 200 OK
Response: Filtered books
```

**Pagination Request:**
```
URL: http://skunkworks.ignitesol.com:8000/books?mime_type=image/&topic=FICTION&page=2
Status: 200 OK
Response: Next page of books
```

#### API Filters
- [ ] `mime_type=image/` is always included
- [ ] `topic` parameter matches selected category
- [ ] `search` parameter is URL-encoded
- [ ] Pagination URLs are followed correctly

---

### 9. Browser Compatibility Tests

Test in different browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

---

### 10. Error Handling Tests

#### Network Errors
- [ ] Handles API being down gracefully
- [ ] Shows error message in console
- [ ] Doesn't crash the app

#### Invalid Data
- [ ] Handles books without images
- [ ] Handles books without authors
- [ ] Handles books without formats
- [ ] Handles empty results

---

## 🐛 Known Issues to Check

1. **Font Loading:** Verify Montserrat fonts load from `/public/fonts/`
2. **SVG Icons:** Check all category icons display correctly
3. **Pattern Background:** Verify background pattern appears
4. **CORS:** Ensure API calls work (CORS headers must be set by server)

---

## 📊 Expected Results

### Category Page (e.g., FICTION)
- **Books Returned:** 32 per page (initial load)
- **Total Books:** Varies by category (200-5000+)
- **Load Time:** < 1 second for initial load
- **Images:** All books should have cover images

### Search Results (e.g., "vampire" in FICTION)
- **Books Returned:** Filtered subset
- **Match Criteria:** Title OR author contains search term
- **Case Sensitivity:** Case-insensitive
- **Debounce:** 450ms delay

---

## 🎯 Critical Path Test

**Complete this test to verify core functionality:**

1. Open app at `http://localhost:5173`
2. Click "FICTION" category
3. Verify books load with covers
4. Scroll down to trigger infinite scroll
5. Verify more books load
6. Type "vampire" in search box
7. Wait 500ms and verify results filter
8. Click on a book
9. Verify book opens in new tab (HTML/PDF/TXT)
10. Go back and click "Back" button
11. Verify returns to home page
12. Click different category (e.g., "DRAMA")
13. Verify new category loads correctly

**If all steps pass, the app is working correctly! ✅**

---

## 🔍 Debugging Tips

### If books don't load:
1. Check browser console for errors
2. Verify API is accessible: `http://skunkworks.ignitesol.com:8000/books`
3. Check Network tab for failed requests
4. Verify `mime_type=image/` parameter is included

### If infinite scroll doesn't work:
1. Check if `next` URL exists in API response
2. Verify Intersection Observer is supported
3. Check console for errors
4. Ensure sentinel element exists at bottom

### If search doesn't work:
1. Verify debounce timer is working (450ms)
2. Check Network tab for search API calls
3. Verify `search` parameter is URL-encoded
4. Check for console errors

---

## 📝 Manual Test Report Template

```
Date: __________
Tester: __________
Browser: __________
Screen Size: __________

HOME PAGE:         ✅ / ❌
CATEGORY PAGE:     ✅ / ❌
INFINITE SCROLL:   ✅ / ❌
SEARCH:            ✅ / ❌
BOOK OPENING:      ✅ / ❌
RESPONSIVE:        ✅ / ❌
PERFORMANCE:       ✅ / ❌

Notes:
_______________________________________
_______________________________________
_______________________________________
```

---

**Happy Testing! 🎉**

