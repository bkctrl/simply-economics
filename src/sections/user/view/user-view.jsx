import { useState, useRef, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { useUser } from 'src/UserContext';
import 'aws-amplify/auth/enable-oauth-listener';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import IconButton from '@mui/material/IconButton';
import { handleUpdateUserAttribute, handleUpdatePassword, uploadToS3 } from "src/lib/cognitoActions";
import { useRouter } from 'src/routes/hooks';
import AOS from 'aos';

export default function UserPage() {
  const { user, attributes, isLoggedIn, loading } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    current_password: '',
    new_password: '',
    new_pfp: null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef(null);

  const handleProfilePictureUpload = async (file) => {
    console.log("handleProfilePictureUpload Triggered")
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const profilePictureUrl = await uploadToS3(file);
      await handleUpdateUserAttribute({
        new_pfp: profilePictureUrl,
      });
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    if (files && files.length > 0) {
      console.log("FILE UPLOADED")
      setFormData({
        ...formData,
        [name]: files[0], 
      });
      handleProfilePictureUpload(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleUpdateAttribute = async (e) => {
    console.log("handleUpdateAttribute triggered");
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await handleUpdateUserAttribute(formData);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
      window.location.reload();
    }
  };

  const handleUpdateUserPassword = async (e) => {
    console.log("handleUpdateUserPassword triggered");
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await handleUpdatePassword(formData);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
      window.location.reload();
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <Container maxWidth="xl">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" style={{paddingLeft: "10rem"}}>Update Profile</Typography>
      </Stack>
      <Grid container spacing={1} style={{paddingLeft: "10rem", paddingRight: "10rem"}} >
        <Grid xs={48} sm={24} md={12}>
          <div style={{ position: "relative" }} data-aos="fade-up" data-aos-duration="1500">
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              position: "relative",
            }}>
              <img
                src="assets/background/overlay_2.jpg"
                alt="Cover"
                className="w-full h-48 object-cover"
                width="100%"
                height="200"
                style={{ aspectRatio: "800/200", objectFit: "cover", borderRadius: "1rem 1rem 0 0", zIndex: -1}}
              />
              <img
                src="assets/background/plain_white.png"
                alt="Cover"
                className="w-full h-48 object-cover"
                width="100%"
                height="500"
                style={{ aspectRatio: "800/200", objectFit: "cover", borderRadius: "0 0 1rem 1rem", zIndex: -1}}
              />
              <Avatar 
                src={isLoggedIn ? attributes.picture : "https://simplyeconomics.s3.ca-central-1.amazonaws.com/placeholder-pfp.jpg"} alt="Avatar"
                sx={{
                  width: "5.5rem",
                  height: "5.5rem",
                  border: `solid 3px white`,
                  marginTop: "-34rem", 
                }}/>
            </div>
            {!user &&
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', paddingTop: '10rem'}}>
              <h1>Please Sign In!</h1>
            </div>
            }
            {user &&
            <div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <h3>{attributes.name}</h3>
                <p style={{marginTop: "-0.5rem"}}>{attributes.email}</p>
              </div>
              <div style={{padding:"3rem"}}>
                <Grid container spacing={2}>
                  <Grid xs={16} sm={8} md={4}>
                    <Typography variant="h5" style={{paddingBottom: "1rem"}}>Name</Typography>
                    <TextField name="name" label="New Name" style={{width: "90%"}} 
                      value={formData.name} onChange={handleInputChange}/>
                    <div style={{paddingTop: "1rem"}}></div>
                    <Button color="primary" size="medium" variant="text" style={{ width: "90%" }}
                      loading={isSubmitting} disabled={isSubmitting} onClick={handleUpdateAttribute} >
                      <FilePenIcon className="w-3 h-3" /> <span style={{paddingLeft: "0.5rem"}}>Update Name </span>
                    </Button>
                  </Grid>

                  <Grid xs={16} sm={8} md={4}>
                    <Typography variant="h5" style={{paddingBottom: "1rem"}} >Password</Typography>
                    <TextField name="current_password" label="Current Password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={formData.current_password} onChange={handleInputChange} 
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                              <Iconify icon={showCurrentPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }} 
                      style={{width: "90%"}}/>
                    <div style={{paddingTop: "1rem"}}></div>
                    <TextField name="new_password" label="New Password"
                      type={showNewPassword ? 'text' : 'password'} 
                      value={formData.new_password} onChange={handleInputChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                              <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }} 
                      style={{width: "90%"}}/>
                    <div style={{paddingTop: "1rem"}}></div>
                    <Button color="secondary" size="medium" variant="text" style={{ width: "90%" }}
                      loading={isSubmitting} disabled={isSubmitting} onClick={handleUpdateUserPassword}>
                      <KeyIcon className="w-3 h-3" /> <span style={{paddingLeft: "0.5rem"}}>Update Password</span>
                    </Button>
                  </Grid>

                  <Grid xs={16} sm={8} md={4}>
                    <Typography variant="h5" style={{paddingBottom: "1rem"}}>Profile Picture</Typography>
                    <div style={{paddingTop: "1rem"}}></div>
                    <input
                      type="file"
                      name="profilePicture"
                      accept="image/*"
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      onChange={handleInputChange} 
                    />
                    <Button color="warning" size="medium" variant="text" style={{ width: "90%" }}
                      onClick={triggerFileInput} loading={isSubmitting} disabled={isSubmitting}>
                      <UploadIcon className="w-3 h-3"/>
                      <span style={{paddingLeft: "0.5rem"}}>Upload New Picture</span>
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
            }
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  )
}


function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}

function KeyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 2-9.6 9.6" />
      <circle cx="7.5" cy="15.5" r="5.5" />
    </svg>
  )
}
