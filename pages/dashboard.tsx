import React, { useEffect, useState } from 'react';
import { Card, Title, DonutChart } from '@tremor/react';
import {
  ButtonGroup,
  Grid,
  Container,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { UserStatistics } from '../lib/types';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useLoaderContext } from '../context/LoaderContext';
import { checkAuth } from '../services/checkAuth';
import { GetServerSidePropsContext } from 'next';
import Loader from "../components/Loader"; 

async function fetchUserStatistics(): Promise<UserStatistics> {
  const response = await fetch('/api/fetch-user-statistics');
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error fetching user statistics');
  }

  return data as UserStatistics;
}

const Dashboard: React.FC = () => {
  const { session } = useSessionContext();
  const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(
    null,
  );
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { loading, setLoading } = useLoaderContext();
  const [displayWeek, setDisplayWeek] = useState(true);

  useEffect(() => {
    if (!userStatistics) {
      if (!session) return;

      setLoading(true);
      const fetchData = async () => {
        try {
          const stats = await fetchUserStatistics();
          setUserStatistics(stats);
          setFetchError(null);
        } catch (error) {
          if (error instanceof Error) {
            setFetchError(error.message);
          } else {
            console.error('error when fetching user statistics:', error);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [session]);

  if (!userStatistics) {
    return <Loader />
  }

  const totalEmails = displayWeek
    ? userStatistics.total_emails_week
    : userStatistics.total_emails_all_time;
  const spamCount = displayWeek
    ? userStatistics.warning_week + userStatistics.danger_week
    : userStatistics.warning_all_time + userStatistics.danger_all_time;
  const spamRate = totalEmails > 0 ? (spamCount / totalEmails) * 100 : 0;

  const chartData = [
    {
      label: 'Safe',
      value: displayWeek
        ? userStatistics.safe_week
        : userStatistics.safe_all_time,
    },
    {
      label: 'Warning',
      value: displayWeek
        ? userStatistics.warning_week
        : userStatistics.warning_all_time,
    },
    {
      label: 'Danger',
      value: displayWeek
        ? userStatistics.danger_week
        : userStatistics.danger_all_time,
    },
  ];

  const spamRateData = [
    { label: 'Spam', value: spamRate },
    { label: 'Non-Spam', value: 100 - spamRate },
  ];

  return (
    <Container   sx={{
      mb: { xs: 6, sm: 6 },
    }}>
      <Box mt={4} mb={4}>
        <ButtonGroup variant="contained">
          <Button
            onClick={() => setDisplayWeek(true)}
            className={`text-base ${
              displayWeek
                ? 'text-main bg-header'
                : 'text-header bg-main'
            } hover:text-main hover:bg-customBackgroundHoverColor`}
          >
            Semaine
          </Button>

          <Button
            onClick={() => setDisplayWeek(false)}
            className={`text-base ${
              !displayWeek
                ? 'text-main bg-header'
                : 'text-header bg-main'
            } hover:text-main hover:bg-customBackgroundHoverColor`}
          >
            Depuis le début
          </Button>
        </ButtonGroup>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <Title>Total des emails analysés: {totalEmails}</Title>
            <DonutChart 
            data={chartData} 
            colors={["green", "yellow", "red"]}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <Title>Taux de spam: {spamRate.toFixed(2)}%</Title>
            <DonutChart 
            data={spamRateData} 
            colors={["red", "green"]}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const redirectResult = await checkAuth(ctx);

    if (redirectResult && typeof redirectResult === 'object') {
      return redirectResult;
    }

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      notFound: true,
    };
  }
};

export default Dashboard;
