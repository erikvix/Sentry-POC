import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllDeals } from "@/services/getAllDeals";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ErrorModal } from "../ModalError";
import axios from "axios";
import Spinner from "../Spinner";
import { captureException } from "@sentry/react";

export default function Home() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const getGames = async () => {
      try {
        setGames(await getAllDeals(pageNumber));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getGames();
  }, [pageNumber]);

  const handleError = () => {
    setIsLoading(true);
    setTimeout(() => {
      axios
        .get("https://www.cheapshark.com/api/1.0/deals", { timeout: 1 })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          setError(error?.message);
          captureException(error);
          throw new Error(`Erro na requisição: ${error.message || error}`);
        })
        .finally(() => {
          setIsLoading(false);
          setError(null);
        });
    }, 5000);
  };

  const get15DollarsGames = () => {
    try {
      return fetch("https://www.cheapshark.com/api/10/")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    } catch (error) {
      return <ErrorModal message={error.message} />;
    }
  };

  const handleNextPage = () => {
    setPageNumber(pageNumber + 1);
  };

  const handlePreviousPage = () => {
    setPageNumber(pageNumber - 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && <ErrorModal message={error} />}
      <>
        <div className="flex justify-center gap-4 items-center mb-4">
          <Button onClick={handleError}>
            {isLoading ? <Spinner /> : "Under $15"}
          </Button>
          <Button onClick={get15DollarsGames}>Under $15</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {games.map((game, index) => (
            <Card
              key={index}
              className=" flex flex-col justify-between text-card-foreground"
            >
              <CardHeader className="p-4">
                <a
                  href={`https://www.cheapshark.com/redirect?dealID=${game.dealID}`}
                >
                  <img
                    src={game.thumb}
                    alt={game.title}
                    className="w-full h-auto object-cover rounded-md"
                  />
                </a>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="font-medium line-clamp-2 mb-2">
                  {game.title}
                </CardTitle>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-lime-500 font-semibold">
                    ${game.salePrice}
                  </span>
                  <Badge variant="secondary" className="line-through">
                    ${game.normalPrice}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Badge className="w-full justify-center bg-lime-600 hover:bg-lime-700 text-white">
                  {Math.round(parseFloat(game.savings))}% OFF
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className=" flex justify-center items-center mt-8 space-x-4">
          <Button onClick={handlePreviousPage} disabled={pageNumber === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <span className="text-sm font-medium">Página {pageNumber}</span>
          <Button onClick={handleNextPage}>
            Próxima
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </>
    </div>
  );
}
