import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import {
  TrendingUp,
  TrendingDown,
  Target,
  BookOpen,
  Clock,
  Award,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function Analytics() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("score");
  const { user } = useAuth();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (user) {
      fetchQuizAnalytics();
    }
  }, [user, timeRange]);

  const fetchQuizAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendURL}/api/transcribe/analytics?range=${timeRange}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setQuizData(data.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalQuizzes = quizData.length;
  const averageScore =
    totalQuizzes > 0
      ? Math.round(
          quizData.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes
        )
      : 0;
  const highestScore =
    totalQuizzes > 0 ? Math.max(...quizData.map((q) => q.score)) : 0;
  const improvementTrend = calculateTrend();

  function calculateTrend() {
    if (quizData.length < 2) return 0;
    const recent =
      quizData.slice(-5).reduce((sum, q) => sum + q.score, 0) /
      Math.min(5, quizData.length);
    const older =
      quizData.slice(0, -5).reduce((sum, q) => sum + q.score, 0) /
      Math.max(1, quizData.length - 5);
    return Math.round(recent - older);
  }

  // Prepare chart data
  const lineChartData = [
    {
      id: "Quiz Scores",
      data: quizData.map((quiz, index) => ({
        x: index + 1,
        y: quiz.score,
        date: new Date(quiz.createdAt).toLocaleDateString(),
      })),
    },
  ];

  const barChartData = quizData.reduce((acc, quiz) => {
    const scoreRange = Math.floor(quiz.score / 10) * 10;
    const range = `${scoreRange}-${scoreRange + 9}%`;
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(barChartData).map(([range, count]) => ({
    range,
    count,
    color: range.startsWith("9")
      ? "#10b981"
      : range.startsWith("8")
      ? "#3b82f6"
      : range.startsWith("7")
      ? "#f59e0b"
      : "#ef4444",
  }));

  const pieData = [
    {
      id: "Excellent (90-100%)",
      value: quizData.filter((q) => q.score >= 90).length,
      color: "#10b981",
    },
    {
      id: "Good (80-89%)",
      value: quizData.filter((q) => q.score >= 80 && q.score < 90).length,
      color: "#3b82f6",
    },
    {
      id: "Fair (70-79%)",
      value: quizData.filter((q) => q.score >= 70 && q.score < 80).length,
      color: "#f59e0b",
    },
    {
      id: "Needs Work (<70%)",
      value: quizData.filter((q) => q.score < 70).length,
      color: "#ef4444",
    },
  ].filter((item) => item.value > 0);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Quiz Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your learning progress and performance insights
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {totalQuizzes === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No quiz data yet</h3>
            <p className="text-muted-foreground mb-4">
              Take some quizzes to see your analytics here
            </p>
            <Button
              onClick={() => (window.location.href = "/quizzes")}
              className="text-white"
            >
              Take Your First Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Quizzes
                    </p>
                    <p className="text-2xl font-bold">{totalQuizzes}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chart-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Average Score
                    </p>
                    <p className="text-2xl font-bold">{averageScore}%</p>
                  </div>
                  <Target className="h-8 w-8 text-chart-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chart-3">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Highest Score
                    </p>
                    <p className="text-2xl font-bold">{highestScore}%</p>
                  </div>
                  <Award className="h-8 w-8 text-chart-3" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chart-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Improvement
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">
                        {Math.abs(improvementTrend)}%
                      </p>
                      {improvementTrend > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : improvementTrend < 0 ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                  <Clock className="h-8 w-8 text-chart-4" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Score Trend Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Score Progression</CardTitle>
                <CardDescription>Your quiz scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveLine
                    data={lineChartData}
                    margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                    xScale={{ type: "linear" }}
                    yScale={{ type: "linear", min: 0, max: 100 }}
                    curve="monotoneX"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Quiz Number",
                      legendOffset: 36,
                      legendPosition: "middle",
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Score (%)",
                      legendOffset: -40,
                      legendPosition: "middle",
                    }}
                    colors={["#3b82f6"]}
                    pointSize={8}
                    pointColor={{ theme: "background" }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: "serieColor" }}
                    enableGridX={false}
                    enableGridY={true}
                    useMesh={true}
                    theme={{
                      background: "transparent",
                      text: { fill: "#a1a1aa" },
                      axis: { ticks: { text: { fill: "#a1a1aa" } } },
                      grid: { line: { stroke: "#262626" } },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Score Distribution Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>
                  How your scores are distributed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveBar
                    data={barData}
                    keys={["count"]}
                    indexBy="range"
                    margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                    padding={0.3}
                    colors={({ data }) => data.color}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -45,
                      legend: "Score Range",
                      legendOffset: 50,
                      legendPosition: "middle",
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Number of Quizzes",
                      legendOffset: -40,
                      legendPosition: "middle",
                    }}
                    enableGridY={true}
                    theme={{
                      background: "transparent",
                      text: { fill: "#a1a1aa" },
                      axis: { ticks: { text: { fill: "#a1a1aa" } } },
                      grid: { line: { stroke: "#262626" } },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Pie Chart */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
                <CardDescription>
                  Distribution of your quiz grades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsivePie
                    data={pieData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors={({ data }) => data.color}
                    borderWidth={1}
                    borderColor={{
                      from: "color",
                      modifiers: [["darker", 0.2]],
                    }}
                    enableArcLinkLabels={false}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor="#ffffff"
                    theme={{
                      background: "transparent",
                      text: { fill: "#ffffff" },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent Quizzes */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Quiz Results</CardTitle>
                <CardDescription>Your latest quiz performances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizData
                    .slice(-5)
                    .reverse()
                    .map((quiz, index) => (
                      <div
                        key={quiz._id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <Badge
                              variant={
                                quiz.score >= 80
                                  ? "default"
                                  : quiz.score >= 60
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {quiz.score}%
                            </Badge>
                          </div>
                          <div>
                            <p className="font-medium">{quiz.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {quiz.correctAnswers}/{quiz.totalQuestions}{" "}
                              correct
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(quiz.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(quiz.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
