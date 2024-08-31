import { React, useState, useEffect } from 'react';
import { Box, Typography, Avatar, Stack, IconButton, Backdrop, Modal, TextField,Fade } from '@mui/material';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUser } from 'src/UserContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PostDetailPopover({ anchorEl, handleClose, post, randImageNum, onEditPost, onDeletePost }) {
  const { user, attributes, isLoggedIn } = useUser();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const isPostAuthor = isLoggedIn && user.userId === post.author_user_id;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_RDS_APIURL}/comments?postId=${post.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error('Failed to fetch comments:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    if (post.id) {
      fetchComments();
    }
  }, [post.id]);

  const handleAddComment = async () => {
    console.log(post.id)
    if (newComment.trim() !== '') {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_RDS_APIURL}/add-comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId: post.id,
            content: newComment,
            author_user_id: user.userId,
            author_name: attributes.name,
            author_avatar_url: attributes.picture,
          }),
        });

        if (response.ok) {
          setComments([...comments, { postId: post.id, content: newComment, author_user_id: user.userId, author_name: attributes.name, author_avatar_url: attributes.picture, created_at: new Date() }]);
          setNewComment('');
        } else {
          console.error('Failed to add comment:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  const handleSaveEdit = () => {
    onEditPost(post.id, editedTitle, editedContent);
    setIsEditing(false);
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDeletePost(post.id);
      handleClose();
    }
  };

  return (
    <Modal
      open={Boolean(anchorEl)}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0)', // Lighten the shadowing effect
        },
      }}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }} 
    >
      <Fade in={Boolean(anchorEl)}>
        <Box
          sx={{
            position: 'relative',
            width: 'calc(100% - 300px)',
            height: '100%',
            bgcolor: 'background.paper',
            boxShadow: 'none',
            overflowY: 'auto',  
            bgcolor: '#F9FAFB',
            pt: 4,
            pb: 4, 
          }}
        >
          <Stack direction="row" alignItems="center" mb={2}>
            <IconButton onClick={handleClose} sx={{ mr: 2 }} style={{ marginLeft: "1rem" }}>
              <ArrowBackIcon />
              <Typography variant="h6" component="h2">
                &nbsp;Back
              </Typography>
            </IconButton>
            {isPostAuthor && !isEditing && (
              <Stack direction="row" spacing={2} sx={{ ml: 'auto', mr: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  startIcon={<EditIcon />}
                  sx={{ color: 'white' }} 
                >
                  Edit Post
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeletePost}
                  startIcon={<DeleteIcon />}
                  sx={{ color: 'white' }}
                >
                  Delete Post
                </Button>
              </Stack>
            )}
            {isEditing && (
              <Stack direction="row" spacing={2} sx={{ ml: 'auto', mr: 4 }}>
                <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </Stack>
            )}
          </Stack>
          <Box
            sx={{
              height: '45%',
              position: 'relative',
              width: '100%', 
              background: `url(/assets/images/covers/cover_${randImageNum}.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&:after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0, 0, 0, 0.5)',  
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                zIndex: 2,
                color: 'white',
              }}
            >
              {isEditing ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 1,
                  }}
                />
              ) : (
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 'semi-bold',
                    paddingLeft: '3rem',
                    paddingTop: '2.5rem',
                    maxWidth: '70rem', 
                    wordWrap: 'break-word', 
                    whiteSpace: 'normal', 
                  }}
                >
                  {post.title}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                zIndex: 2,
                color: 'white',
                p: 4,
                width: '100%',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} style={{ paddingLeft: "2.3rem" }}>
                <Avatar alt={post.author_name} src={post.author_avatar_url} />
                <Box>
                  <Typography variant="subtitle1">{post.author_name}</Typography>
                  <Typography variant="caption">
                    {new Date(post.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          <Box sx={{ mt: 4, px: 2, display: 'flex', justifyContent: 'center' }}>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                sx={{
                  maxWidth: '700px',
                }}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  fontSize: '1.21rem',
                  lineHeight: 1.7,
                  maxWidth: '700px', 
                  textAlign: 'left', 
                  whiteSpace: 'pre-line', 
                }}
                style={{ paddingTop: "2rem" }}
              >
                {post.content}
              </Typography>
            )}
          </Box>

          <div style={{ paddingLeft: '20rem', paddingRight: '20rem', paddingTop: '6rem', paddingBottom: '3rem' }}>
            <Box sx={{ mt: 6, px: 4, pl: '2rem' }}>
              <Typography variant="h5" sx={{ mb: 2, pb: '1rem' }}>
                Comments
              </Typography>
              <Stack spacing={2}>
                {comments.length === 0 && (<div>No comments yet. Add the first comment!</div>)}
                {comments && comments.map((comment, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar alt={comment.author_name} src={comment.author_avatar_url} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2">{comment.author_name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {comment.content}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Box sx={{ mt: 4 }}>
                <TextField
                  fullWidth
                  label="Add a comment"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleAddComment}
                >
                  Post Comment
                </Button>
              </Box>
            </Box>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
