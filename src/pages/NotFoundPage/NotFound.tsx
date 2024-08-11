import { Box, Link } from '@mui/material';
import { routesPath } from 'src/routes/routes';

export const NotFound = () => {
  return (
    <Box
      sx={{
        mt: '5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1>Page Not Found 😵</h1>
      <Link href={routesPath.HOME} color="inherit">
        Back to home
      </Link>
    </Box>
  );
};
