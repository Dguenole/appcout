
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ObjectiveFunction from "./ObjectiveFunction";
import ConstraintsTable from "./ConstraintsTable";
import SimplexResults from "./SimplexResults";
import { solveSimplex } from "@/utils/simplexSolver";
import { toast } from "sonner";

interface SimplexData {
  numProducts: number;
  numResources: number;
  objectiveCoefficients: number[];
  constraints: {
    coefficients: number[][];
    bounds: number[];
    operators: string[];
  };
}

const ProductionOptimizer = () => {
  const [numProducts, setNumProducts] = useState(2);
  const [numResources, setNumResources] = useState(2);
  const [objectiveCoefficients, setObjectiveCoefficients] = useState<number[]>([5, 3]);
  const [constraints, setConstraints] = useState({
    coefficients: [[3, 2], [2, 1]],
    bounds: [100, 80],
    operators: ["≤", "≤"]
  });
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleProductsChange = (value: string) => {
    const num = parseInt(value) || 2;
    setNumProducts(num);
    
    // Adjust objective coefficients
    const newCoeffs = [...objectiveCoefficients];
    while (newCoeffs.length < num) newCoeffs.push(0);
    while (newCoeffs.length > num) newCoeffs.pop();
    setObjectiveCoefficients(newCoeffs);
    
    // Adjust constraints coefficients
    const newConstraints = { ...constraints };
    newConstraints.coefficients = newConstraints.coefficients.map(row => {
      const newRow = [...row];
      while (newRow.length < num) newRow.push(0);
      while (newRow.length > num) newRow.pop();
      return newRow;
    });
    setConstraints(newConstraints);
  };

  const handleResourcesChange = (value: string) => {
    const num = parseInt(value) || 2;
    setNumResources(num);
    
    // Adjust constraints
    const newConstraints = { ...constraints };
    while (newConstraints.coefficients.length < num) {
      newConstraints.coefficients.push(new Array(numProducts).fill(0));
      newConstraints.bounds.push(0);
      newConstraints.operators.push("≤");
    }
    while (newConstraints.coefficients.length > num) {
      newConstraints.coefficients.pop();
      newConstraints.bounds.pop();
      newConstraints.operators.pop();
    }
    setConstraints(newConstraints);
  };

  const handleSolve = async () => {
    setIsCalculating(true);
    try {
      const simplexData: SimplexData = {
        numProducts,
        numResources,
        objectiveCoefficients,
        constraints
      };
      
      const solution = solveSimplex(simplexData);
      setResults(solution);
      toast.success("Optimisation résolue avec succès!");
    } catch (error) {
      console.error("Erreur lors de la résolution:", error);
      toast.error("Erreur lors de la résolution du problème d'optimisation");
    } finally {
      setIsCalculating(false);
    }
  };

  const resetForm = () => {
    setNumProducts(2);
    setNumResources(2);
    setObjectiveCoefficients([5, 3]);
    setConstraints({
      coefficients: [[3, 2], [2, 1]],
      bounds: [100, 80],
      operators: ["≤", "≤"]
    });
    setResults(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Optimisation de Production par la méthode du Simplexe
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Résolvez vos problèmes d'optimisation de production en définissant vos objectifs et contraintes.
          L'algorithme du Simplexe trouvera la solution optimale pour maximiser vos bénéfices.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Configuration initiale */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Étape 1
                </Badge>
                Configuration du problème
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="products">Nombre de produits</Label>
                  <Input
                    id="products"
                    type="number"
                    min="1"
                    max="10"
                    value={numProducts}
                    onChange={(e) => handleProductsChange(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="resources">Nombre de ressources</Label>
                  <Input
                    id="resources"
                    type="number"
                    min="1"
                    max="10"
                    value={numResources}
                    onChange={(e) => handleResourcesChange(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fonction objectif */}
          <ObjectiveFunction
            numProducts={numProducts}
            coefficients={objectiveCoefficients}
            onCoefficientsChange={setObjectiveCoefficients}
          />

          {/* Contraintes */}
          <ConstraintsTable
            numProducts={numProducts}
            numResources={numResources}
            constraints={constraints}
            onConstraintsChange={setConstraints}
          />

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleSolve}
                  disabled={isCalculating}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg"
                >
                  {isCalculating ? "Calcul en cours..." : "Résoudre"}
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="px-8 py-3 text-lg"
                >
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Résultats */}
        <div className="xl:col-span-1">
          {results ? (
            <SimplexResults results={results} />
          ) : (
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-center text-muted-foreground">
                  Résultats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <p className="text-muted-foreground">
                    Cliquez sur "Résoudre" pour voir les résultats de l'optimisation
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionOptimizer;
