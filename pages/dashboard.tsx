
import React, { useEffect, useState } from "react";
import { Card, Title, DonutChart } from "@tremor/react";
import { ButtonGroup, Grid, Container, Box, Button, Typography } from "@mui/material";
import { UserStatistics } from "../lib/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useLoaderContext } from '../context/LoaderContext';

async function fetchUserStatistics(): Promise<UserStatistics> {
  const response = await fetch("/api/fetch-user-statistics");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error fetching user statistics");
  }

  return data as UserStatistics;
}



const Dashboard: React.FC = () => {
  const { session } = useSessionContext();
  const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { loading, setLoading } = useLoaderContext();
  const [displayWeek, setDisplayWeek] = useState(true);
console.log(userStatistics, "userStatistics")

  useEffect(() => {
    if(!userStatistics) {
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
           console.error("error when fetching user statistics:", error);
         }
       } finally {
           setLoading(false);
         }
       };
      fetchData();
    }

  }, [session]);

  const generateChartData = () => {
    if (!userStatistics) return [];
  
    const stats = displayWeek
      ? {
          safe: userStatistics.safe_week,
          warning: userStatistics.warning_week,
          danger: userStatistics.danger_week,
        }
      : {
          safe: userStatistics.safe_all_time,
          warning: userStatistics.warning_all_time,
          danger: userStatistics.danger_all_time,
        };
  
    return [
      { name: "Safe", value: stats.safe, color: "green" },
      { name: "Warning", value: stats.warning, color: "yellow" },
      { name: "Danger", value: stats.danger, color: "red" },
    ];
  };
  

  if (!session) {
    return (
      <div>
        <Typography variant="h4">Please sign in to view your dashboard.</Typography>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div>
        <Typography variant="h4">Error: {fetchError}</Typography>
      </div>
    );
  }

  if (!userStatistics) {
    return (
      <div>
        <Typography variant="h4">Loading...</Typography>
      </div>
    );
  }

  return (
    <Container>
      <Box sx={{ textAlign: "center", marginBottom: 2 }}>
        <ButtonGroup>
          <Button
            variant={displayWeek ? "contained" : "outlined"}
            onClick={() => setDisplayWeek(true)}
          >
            Week
          </Button>
          <Button
            variant={!displayWeek ? "contained" : "outlined"}
            onClick={() => setDisplayWeek(false)}
          >
            All Time
          </Button>
        </ButtonGroup>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
        <Card className="max-w-lg">
    <Title>Sales</Title>
    <DonutChart
      className="mt-6"
      data={generateChartData()}
      colors={["green", "amber", "red"]}
    />
  </Card>
        </Grid>
        <Grid item xs={12} md={6}>
        </Grid>
      </Grid>
    </Container>
  );
  
};

export default Dashboard;



