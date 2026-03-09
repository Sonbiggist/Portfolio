export const profileData = {
  name: "Nguyễn Xuân Sơn",
  title: "Creative Professional",
  bio: "I am a passionate creative professional with a love for design and storytelling. I specialize in creating visually stunning and engaging experiences.",
  avatar_url: "https://picsum.photos/seed/avatar/400/400",
  email: "nguyenxuansonkk@gmail.com",
  phone: "+84 123 456 789",
  location: "Ho Chi Minh City, Vietnam",
  social_links: JSON.stringify({
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com"
  })
};

export const categoriesData = [
  { id: 1, name: "Photography", type: "image", description: "My best shots" },
  { id: 2, name: "Videography", type: "video", description: "Cinematic videos" },
  { id: 3, name: "Design", type: "image", description: "UI/UX and Graphic Design" }
];

export const portfolioItemsData = [
  {
    id: 1,
    category_id: 1,
    title: "Urban Exploration",
    description: "A series of photos capturing the essence of city life.",
    media_url: "https://picsum.photos/seed/urban/800/600",
    category_type: "image"
  },
  {
    id: 2,
    category_id: 1,
    title: "Nature's Beauty",
    description: "Breathtaking landscapes from around the world.",
    media_url: "https://picsum.photos/seed/nature/800/600",
    category_type: "image"
  },
  {
    id: 3,
    category_id: 2,
    title: "Cinematic Travel Vlog",
    description: "A short film documenting my recent travels.",
    media_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category_type: "video"
  },
  {
    id: 4,
    category_id: 3,
    title: "Modern App UI",
    description: "A sleek and intuitive user interface design for a mobile app.",
    media_url: "https://picsum.photos/seed/ui/800/600",
    category_type: "image"
  }
];
