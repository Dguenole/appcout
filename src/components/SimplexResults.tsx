
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SimplexResultsProps {
  results: {
    solution: number[];
    objectiveValue: number;
    iterations: any[];
    status: string;
  };
}

const SimplexResults = ({ results }: SimplexResultsProps) => {
  const formatNumber = (num: number) => {
    return Number(num.toFixed(3));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✓ Résolu
            </Badge>
            Solution optimale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatNumber(results.objectiveValue)}
            </div>
            <p className="text-sm text-muted-foreground">Valeur optimale (Z max)</p>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="font-medium text-center">Variables de décision</h4>
            {results.solution.map((value, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-medium">x{index + 1} =</span>
                <span className="font-mono text-lg">{formatNumber(value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {results.iterations && results.iterations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Résolution Simplexe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.iterations.map((iteration, index) => (
                <div key={index} className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    Étape {index + 1}
                  </Badge>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse border border-gray-300">
                      <tbody>
                        {iteration.tableau.map((row: number[], rowIndex: number) => (
                          <tr key={rowIndex} className={rowIndex === 0 ? "bg-blue-50" : ""}>
                            {row.map((cell: number, cellIndex: number) => (
                              <td key={cellIndex} className="border border-gray-300 p-1 text-center">
                                {formatNumber(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {index === results.iterations.length - 1 && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-sm font-medium text-green-800">
                        Solution optimale trouvée
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimplexResults;
