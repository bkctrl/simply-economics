import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import {
  Box,
  Modal, 
  TextField,
  Backdrop,
  Fade,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useUser } from 'src/UserContext';

export default function AddPostModal({ open, handleClose, handleAddPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, attributes, isLoggedIn } = useUser();

  const isFormValid = title.trim() !== '' && content.trim() !== '';

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setLoading(true);

    try {
      // Make an API call to add the post to the backend
      const response = await fetch(`${import.meta.env.VITE_RDS_APIURL}/add-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          author_name: attributes.name,
          author_user_id: user.userId,
          author_avatar_url: attributes.picture,
        }),
      });

      if (response.ok) {
        const newPost = await response.json();
        
        // Call the handleAddPost to update the frontend
        handleAddPost({
          ...newPost,
          author: {
            name: attributes.name,
            userId: user.userId,
            avatarUrl: attributes.picture,
          },
        });

        setTitle('');
        setContent('');
        handleClose();
      } else {
        console.error('Failed to add post:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to add post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      aria-labelledby="add-post-modal-title"
      aria-describedby="add-post-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 700 },
            height: { xs: '90%', sm: 700 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="add-post-modal-title" variant="h6" component="h2">
              Create New Post
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Content"
            variant="outlined"
            multiline
            rows={17}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            sx={{ flexGrow: 1 }}
          />

          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
            <Button variant="outlined" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              Add Post
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
}