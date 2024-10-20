import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Search, Star, Award, DollarSign, Moon, Sun } from "lucide-react";
import { ErrorModal } from "../ModalError";
import Spinner from "../Spinner";
import { captureException } from "@sentry/react";
import { getMovie } from "@/services/getMovie";
import { Input } from "../ui/input";
import { Separator } from "@radix-ui/react-separator";

export default function Home() {
  const [error, setError] = useState(null);
  const [movie, setMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const searchMovie = async () => {
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const movie = await getMovie(searchTerm);

      if (!movie || movie.Response === "False") {
        setNotFound(true);
        setMovie(null);
      } else {
        setMovie(movie);
      }
    } catch (error) {
      captureException(error);
      setError("Movie not found");
    } finally {
      setIsLoading(false);
    }
  };

  const getError = () => {
    throw new Error("Error");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      <div className="w-full md:w-1/4 p-4 bg-card rounded-md border">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Search Movie</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        </div>
        <div className="space-y-4">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter movie title"
          />
          <Button onClick={searchMovie} className="w-full">
            {isLoading ? <Spinner /> : "Search"}
            {!isLoading && <Search className="ml-2 h-4 w-4" />}
          </Button>
          <Button onClick={getError} className="w-full">
            Error
          </Button>
        </div>
        {error && <p className="text-destructive mt-4">{error}</p>}
        {notFound && (
          <ErrorModal
            message={"Filme não encontrado"}
            onClose={() => setNotFound(false)}
          />
        )}
      </div>

      <div className="flex-1 py-4 md:px-4 md:py-0 overflow-auto">
        {movie && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold">
                {movie.Title}{" "}
                <span className="text-muted-foreground">({movie.Year})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <p className="text-lg">{movie.Plot}</p>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Director</h3>
                      <p>{movie.Director}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Writers</h3>
                      <p>{movie.Writer}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Stars</h3>
                      <p>{movie.Actors}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Genre</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {movie.Genre.split(", ").map((genre) => (
                          <Badge key={genre} variant="secondary">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 mr-1" />
                      <span className="font-bold">{movie.imdbRating}</span>
                      <span className="text-muted-foreground ml-1">
                        ({movie.imdbVotes} votes)
                      </span>
                    </div>
                    <div>
                      <Badge variant="outline">{movie.Rated}</Badge>
                    </div>
                    <div>{movie.Runtime}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold flex items-center">
                        <Award className="mr-1" /> Awards
                      </h3>
                      <p>{movie.Awards}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center">
                        <DollarSign className="mr-1" /> Box Office
                      </h3>
                      <p>{movie.BoxOffice}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
