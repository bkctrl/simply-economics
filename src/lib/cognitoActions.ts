import * as fs from "fs";
import * as AWS from "aws-sdk";

import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resendSignUpCode,
  autoSignIn,
  updateUserAttribute,
  type UpdateUserAttributeOutput,
  confirmUserAttribute,
  updatePassword,
} from "aws-amplify/auth";
import { getErrorMessage } from "src/utils/get-error-messages";

export async function handleSignUp(formData: any) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: String(formData.email),
      password: String(formData.password),
      options: {
        userAttributes: {
          email: String(formData.email),
          name: String(formData.name),
          picture: "https://simplyeconomics.s3.ca-central-1.amazonaws.com/placeholder-pfp.jpg"
        },
        autoSignIn: true,
      },
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  window.location.href = "/confirm-email";
}

export async function handleConfirmSignUp(formData: any) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: String(formData.email),
      confirmationCode: String(formData.code),
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  window.location.href = "/";
}

export async function handleSignIn(formData: any) {
  console.log("handleSignIn triggered");
  let redirectLink = "/";
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: String(formData.email),
      password: String(formData.password),
    });
    console.log("checkpoint");
    if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({
        username: String(formData.email),
      });
      redirectLink = "/confirm-email";
    }
  } catch (error) {
    return getErrorMessage(error);
  }
  console.log("redirect");
  window.location.href = redirectLink;
}

export async function handleSignOut() {
  console.log("handleSignOut triggered");
  try {
    await signOut();
  } catch (error) {
    console.log("signout error");
    console.log(getErrorMessage(error));
  }
  console.log("signout complete");
  window.location.href = "/";
}

export async function handleUpdateUserAttribute(formData: any) {
  let attributeKey;
  let attributeValue;
  if (formData.new_pfp) {
    attributeKey = "picture";
    attributeValue = formData.new_pfp;
  } else if (formData.name) {
    attributeKey = "name";
    attributeValue = formData.name; 
  }
  try {
    const output = await updateUserAttribute({
      userAttribute: {
        attributeKey: String(attributeKey),
        value: String(attributeValue),
      },
    });
    return handleUpdateUserAttributeNextSteps(output);
  } catch (error) {
    console.log(error);
    return "error";
  }
}

function handleUpdateUserAttributeNextSteps(output: UpdateUserAttributeOutput) {
  const { nextStep } = output;
  switch (nextStep.updateAttributeStep) {
    case "CONFIRM_ATTRIBUTE_WITH_CODE":
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      return `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`;
    case "DONE":
      return "success";
  }
}

export async function handleUpdatePassword(formData: any) {
  const currentPassword = formData.current_password;
  const newPassword = formData.new_password;

  if (currentPassword === newPassword) {
    return;
  }

  try {
    await updatePassword({
      oldPassword: String(currentPassword),
      newPassword: String(newPassword),
    });
  } catch (error) {
    console.log(error);
    return "error";
  }

  return "success";
}

export async function handleConfirmUserAttribute(formData: any) {
  const code = formData.code;

  if (!code) {
    return;
  }

  try {
    await confirmUserAttribute({
      userAttributeKey: "email",
      confirmationCode: String(code),
    });
  } catch (error) {
    console.log(error);
    return "error";
  }

  return "success";
}

const s3bucket = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_IAM_USER_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_IAM_USER_SECRET,
  region: 'ca-central-1',
});

export async function uploadToS3(file) {
  console.log("uploadToS3 Triggered");
  const params = {
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
    Key: `${file.name}`, // The key is the path and name of the file in the bucket
    Body: file, // File object from the input
    ContentType: file.type, // Set the content type for the file
    ACL: 'public-read',
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading to S3:", err);
        return reject(err);
      }
      console.log("Successfully uploaded to S3:", data.Location);
      return resolve(data.Location); // Return the URL of the uploaded file
    });
  });
}