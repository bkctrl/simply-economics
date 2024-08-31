import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';
import PostCard from '../post-card';
import AOS from 'aos';
import { useEffect, useState } from 'react';
import AddPostModal from 'src/sections/blog/add-post-modal';
import PostDetailPopover from 'src/sections/blog/post-detail-popover';
import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';

export default function BlogView() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  
  useEffect(() => {
    AOS.init();
    const loadPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_RDS_APIURL}/posts`);
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        const postsFromDb = await response.json();
        setPosts(postsFromDb);
        console.log("Read from RDS:", postsFromDb);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleOpenModal = () => {
    console.log("handleOpenModal triggered");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddPost = (newPost) => {
    setPosts([...posts, newPost]);
  };

  const handleTitleClick = (event, post) => {
    console.log("handleTitleClick triggered");
    setAnchorEl(event.currentTarget);
    setCurrentPost(post);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setCurrentPost(null);
  };

  const handleEditPost = async (postId, newTitle, newContent) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_RDS_APIURL}/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      if (response.ok) {
        setPosts(posts.map(post => post.id === postId ? { ...post, title: newTitle, content: newContent } : post));
        setCurrentPost((prevPost) =>
          prevPost && prevPost.id === postId ? { ...prevPost, title: newTitle, content: newContent } : prevPost
        );
      } else {
        console.error('Failed to edit post:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to edit post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_RDS_APIURL}/posts/${postId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
        setAnchorEl(null);
        setCurrentPost(null);
      } else {
        console.error('Failed to delete post:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const chunkSize = 2;
  const postChunks = [];
  for (let i = 0; i < posts.length; i += chunkSize) {
    postChunks.push(posts.slice(i, i + chunkSize));
  }

  return (
    <Box sx={{ position: 'relative', flexGrow: 1 }}>
      <Container>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Discussions</Typography>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal} >
            New Post
          </Button>
        </Stack>
        {!isLoading ? (postChunks.map((chunk, rowIndex) => (
          <Grid container spacing={2} key={rowIndex}>
            {chunk.map((post, index) => {
              return (
                <Grid item xs={12} sm={6} key={index} data-aos="zoom-in" aos-duration="1500">
                  <PostCard 
                    post={{
                      ...post,
                      cover: `/assets/images/covers/cover_${Math.floor(Math.random() * 24) + 1}.jpg`,
                    }}
                    onTitleClick={(event) => handleTitleClick(event, post)}
                    index={0}
                  />
                </Grid>
              );
            })}
          </Grid>
          ))) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', paddingTop: '20rem'}}>
            <CircularProgress />
          </div>)}
        {currentPost && (
          <PostDetailPopover
            post={currentPost}
            anchorEl={anchorEl}
            handleClose={handlePopoverClose}
            randImageNum={Math.floor(Math.random() * 24) + 1}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
          />
        )}
        <AddPostModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          handleAddPost={handleAddPost}
        />
      </Container>  
    </Box>
  );
}
