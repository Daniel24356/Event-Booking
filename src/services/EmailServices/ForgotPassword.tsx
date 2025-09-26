import { Body, Container, Head, Heading, Html, Text } from '@react-email/components';
import React from 'react'



interface OtpEmailProps {
  otp: string;
  name: string;
}

export const ForgotPassword = ({ otp, name }:OtpEmailProps) => {
  return (
        <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "auto",
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Heading
            style={{ color: "#333", textAlign: "center", marginBottom: "20px" }}
          >
            Forgot Password
          </Heading>
          <Text style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
            Hello {name},
          </Text>
          <Text style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
            You just requested to change your password, if this action was not performed by you, please ignore this email.
          </Text>
          <Text style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
            Here's your one time pin
          </Text>
          <Text
            style={{
              fontSize: "24px",
              fontWeight: 'bold',
              textAlign: "center",
              margin: "20px 0",
              color: "#007BFF",
            }}>
            {otp}
          </Text>
          <Text
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#777",
              textAlign: "center",
            }}
          >
            This pin is only valid for 30 minutes.
          </Text>
        </Container>
      </Body>
    </Html>

  )
}

export default ForgotPassword;