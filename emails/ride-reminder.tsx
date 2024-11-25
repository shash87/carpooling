import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { format } from "date-fns";

interface RideReminderEmailProps {
  passengerName: string;
  driverName: string;
  startLocation: string;
  endLocation: string;
  startTime: Date;
  bookingId: string;
}

export default function RideReminderEmail({
  passengerName,
  driverName,
  startLocation,
  endLocation,
  startTime,
  bookingId,
}: RideReminderEmailProps) {
  const previewText = `Reminder: Your ride tomorrow from ${startLocation} to ${endLocation}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Ride is Tomorrow!</Heading>
          
          <Text style={text}>Hi {passengerName},</Text>
          
          <Text style={text}>
            This is a friendly reminder about your upcoming ride tomorrow:
          </Text>

          <Section style={details}>
            <Text style={detailRow}>
              <strong>Driver:</strong> {driverName}
            </Text>
            <Text style={detailRow}>
              <strong>From:</strong> {startLocation}
            </Text>
            <Text style={detailRow}>
              <strong>To:</strong> {endLocation}
            </Text>
            <Text style={detailRow}>
              <strong>Date:</strong> {format(startTime, "MMMM d, yyyy")}
            </Text>
            <Text style={detailRow}>
              <strong>Time:</strong> {format(startTime, "h:mm a")}
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Please be at the pickup location 5 minutes before the scheduled time.
            You can contact your driver through the app if needed.
          </Text>

          <Text style={footer}>
            Have a great ride with GOALYFT!
          </Text>

          <Hr style={hr} />

          <Text style={footerText}>
            © 2024 GOALYFT. All rights reserved.
            <br />
            <Link href={process.env.NEXT_PUBLIC_APP_URL}>www.goalyft.com</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "5px",
  maxWidth: "600px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.4",
  margin: "0 0 20px",
};

const text = {
  color: "#4c4c4c",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 20px",
};

const details = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "5px",
  margin: "20px 0",
};

const detailRow = {
  margin: "10px 0",
  fontSize: "14px",
  color: "#4c4c4c",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "20px 0",
};

const footer = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "20px 0",
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "1.5",
  textAlign: "center" as const,
};