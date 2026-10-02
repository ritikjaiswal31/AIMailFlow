import { useState } from 'react'
import './App.css'

// Import Material UI components
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';

// Import axios for API requests
import axios from 'axios';

function App() {

  // State to store original email content entered by user
  const [emailContent, setEmailContent] = useState('');

  // State to store selected tone (professional, casual, etc.)
  const [tone, setTone] = useState('');

  // State to store AI-generated reply
  const [generatedReply, setGeneratedReply] = useState('');

  // State to handle loading spinner during API request
  const [loading, setLoading] = useState(false);

  // State to handle API or application errors
  const [error, setError] = useState('');

  /**
   * Handles API request for generating email reply
   */
  const handleSubmit = async () => {

    // Start loading and clear previous errors
    setLoading(true);
    setError('');

    try {

      // Send POST request to backend API
      const response = await axios.post(
        "http://localhost:8080/api/email/generate",
        {
          emailContent,
          tone
        }
      );

      // Store generated reply in state
      // If response is object, convert it to string
      setGeneratedReply(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data)
      );

    } catch (error) {

      // Handle API request failure
      setError('Failed to generate email reply. Please try again');

      // Log detailed error in browser console
      console.error(error);

    } finally {

      // Stop loading spinner regardless of success/failure
      setLoading(false);
    }
  };

  return (

    // Main container with medium width and vertical padding
    <Container maxWidth="md" sx={{ py: 4 }}>

      {/* Application title */}
      <Typography
        variant='h3'
        component="h1"
        gutterBottom
      >
        AIMailFlow
      </Typography>

      {/* Form section */}
      <Box sx={{ mx: 3 }}>

        {/* Email input field */}
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label="Original Email Content"

          // Controlled component value
          value={emailContent || ''}

          // Update state on typing
          onChange={(e) => setEmailContent(e.target.value)}

          // Bottom margin styling
          sx={{ mb: 2 }}
        />

        {/* Tone selection dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>

          {/* Dropdown label */}
          <InputLabel>
            Tone (Optional)
          </InputLabel>

          {/* Tone select menu */}
          <Select
            value={tone || ''}
            label={"Tone (Optional)"}

            // Update tone state on selection
            onChange={(e) => setTone(e.target.value)}
          >

            {/* Available tone options */}
            <MenuItem value="">
              None
            </MenuItem>

            <MenuItem value="professional">
              Professional
            </MenuItem>

            <MenuItem value="casual">
              Casual
            </MenuItem>

            <MenuItem value="friendly">
              Friendly
            </MenuItem>

          </Select>
        </FormControl>

        {/* Generate Reply button */}
        <Button
          variant='contained'

          // Call API handler on click
          onClick={handleSubmit}

          // Disable button if no email content or loading
          disabled={!emailContent || loading}

          fullWidth
        >

          {/* Show spinner while loading */}
          {loading
            ? <CircularProgress size={24} />
            : "Generate Reply"
          }

        </Button>
      </Box>

      {/* Error message section */}
      {error && (

        <Typography
          color='error'
          sx={{ mb: 2 }}
        >
          {error}
        </Typography>

      )}

      {/* Generated reply section */}
      {generatedReply && (

        <Box sx={{ mt: 3 }}>

          {/* Section heading */}
          <Typography
            variant='h6'
            gutterBottom
          >
            Generated Reply:
          </Typography>

          {/* Read-only text field displaying generated reply */}
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'

            // Display generated reply
            value={generatedReply || ''}

            // Prevent editing
            inputProps={{ readOnly: true }}
          />

          {/* Copy to clipboard button */}
          <Button
            variant='outlined'
            sx={{ mt: 2 }}

            // Copy generated reply to clipboard
            onClick={() =>
              navigator.clipboard.writeText(generatedReply)
            }
          >
            Copy to Clipboard
          </Button>

        </Box>
      )}

    </Container>
  )
}

// Export App component
export default App