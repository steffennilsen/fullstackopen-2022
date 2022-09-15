const {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  emptyBlogListHandler,
} = require('#@/utils/list_helper');
const { blogsSingle, blogsMultiple } = require('#@/tests/blogs.helper');

describe('dummy', () => {
  it('should return one', () => {
    const blogs = [];
    const result = dummy(blogs);
    expect(result).toBe(1);
  });
});

describe('totalLikes', () => {
  it('should handle empty array', () => expect(totalLikes([])).toBe(0));
  it('should count single entry', () =>
    expect(totalLikes(blogsSingle)).toBe(5));
  it('should total multiple entries 1', () =>
    expect(totalLikes([{ likes: 3 }, { likes: 7 }])).toBe(10));
  it('should total multiple entries 2', () =>
    expect(totalLikes(blogsMultiple)).toBe(36));
});

describe('emptyBlogListHandler', () => {
  it('should handle empty', () =>
    expect(emptyBlogListHandler([], () => {})).toBeUndefined());
  it('should handle single entry', () =>
    expect(emptyBlogListHandler(blogsSingle, (blog) => blog)).toBe(
      blogsSingle,
    ));
  it('should handle multiple entry', () =>
    expect(emptyBlogListHandler(blogsMultiple, (blog) => blog)).toBe(
      blogsMultiple,
    ));
});

describe('favoriteBlog', () => {
  it('should handle empty array', () =>
    expect(favoriteBlog([])).toBeUndefined());
  it('should handle single entry', () =>
    expect(favoriteBlog(blogsSingle)).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    }));
  it('should handle multiple entries', () =>
    expect(favoriteBlog(blogsMultiple)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }));
});

describe('mostBlogs', () => {
  it('should handle empty array', () => expect(mostBlogs([])).toBeUndefined());

  it('should handle single entry', () =>
    expect(mostBlogs(blogsSingle)).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    }));

  it('should handle multiple entry', () =>
    expect(mostBlogs(blogsMultiple)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    }));
});

describe('mostLikes', () => {
  it('should handle empty array', () => expect(mostLikes([])).toBeUndefined());

  it('should handle single entry', () =>
    expect(mostLikes(blogsSingle)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5,
    }));

  it('should handle multiple entry', () =>
    expect(mostLikes(blogsMultiple)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    }));
});
