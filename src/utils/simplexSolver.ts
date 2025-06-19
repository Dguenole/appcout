
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

interface SimplexResult {
  solution: number[];
  objectiveValue: number;
  iterations: any[];
  status: string;
}

export function solveSimplex(data: SimplexData): SimplexResult {
  console.log("Résolution du problème Simplexe:", data);
  
  const { numProducts, numResources, objectiveCoefficients, constraints } = data;
  
  // Conversion en forme standard (ajout de variables d'écart)
  const numVariables = numProducts + numResources; // variables originales + variables d'écart
  
  // Création du tableau initial du Simplexe
  // Format: [variables de base, variables originales, variables d'écart, RHS]
  const tableau: number[][] = [];
  
  // Ligne de la fonction objectif (à maximiser, donc on minimise -Z)
  const objectiveRow = new Array(numVariables + 1).fill(0);
  for (let i = 0; i < numProducts; i++) {
    objectiveRow[i] = -objectiveCoefficients[i]; // Négatif pour maximisation
  }
  tableau.push(objectiveRow);
  
  // Lignes des contraintes
  for (let i = 0; i < numResources; i++) {
    const row = new Array(numVariables + 1).fill(0);
    
    // Coefficients des variables originales
    for (let j = 0; j < numProducts; j++) {
      row[j] = constraints.coefficients[i][j];
    }
    
    // Variable d'écart (1 à la position correspondante)
    row[numProducts + i] = 1;
    
    // RHS (Right Hand Side)
    row[numVariables] = constraints.bounds[i];
    
    tableau.push(row);
  }
  
  const iterations: any[] = [];
  let iterationCount = 0;
  const maxIterations = 100;
  
  console.log("Tableau initial:", tableau);
  
  // Algorithme du Simplexe
  while (iterationCount < maxIterations) {
    // Sauvegarder l'itération actuelle
    iterations.push({
      iteration: iterationCount,
      tableau: tableau.map(row => [...row])
    });
    
    // 1. Test d'optimalité - chercher le coefficient le plus négatif dans la ligne objectif
    let enteringColumn = -1;
    let minValue = 0;
    
    for (let j = 0; j < numVariables; j++) {
      if (tableau[0][j] < minValue) {
        minValue = tableau[0][j];
        enteringColumn = j;
      }
    }
    
    // Si tous les coefficients sont non-négatifs, solution optimale trouvée
    if (enteringColumn === -1) {
      console.log("Solution optimale trouvée après", iterationCount, "itérations");
      break;
    }
    
    // 2. Test de ratio - trouver la variable sortante
    let leavingRow = -1;
    let minRatio = Infinity;
    
    for (let i = 1; i <= numResources; i++) {
      if (tableau[i][enteringColumn] > 0) {
        const ratio = tableau[i][numVariables] / tableau[i][enteringColumn];
        if (ratio < minRatio) {
          minRatio = ratio;
          leavingRow = i;
        }
      }
    }
    
    // Vérifier si le problème est non borné
    if (leavingRow === -1) {
      console.log("Problème non borné");
      return {
        solution: [],
        objectiveValue: Infinity,
        iterations,
        status: "unbounded"
      };
    }
    
    console.log(`Itération ${iterationCount}: Variable entrante x${enteringColumn + 1}, Variable sortante ligne ${leavingRow}`);
    
    // 3. Opérations de pivot
    const pivotElement = tableau[leavingRow][enteringColumn];
    
    // Diviser la ligne pivot par l'élément pivot
    for (let j = 0; j <= numVariables; j++) {
      tableau[leavingRow][j] /= pivotElement;
    }
    
    // Éliminer la colonne pivot dans les autres lignes
    for (let i = 0; i <= numResources; i++) {
      if (i !== leavingRow) {
        const factor = tableau[i][enteringColumn];
        for (let j = 0; j <= numVariables; j++) {
          tableau[i][j] -= factor * tableau[leavingRow][j];
        }
      }
    }
    
    iterationCount++;
  }
  
  // Extraction de la solution
  const solution = new Array(numProducts).fill(0);
  
  // Identifier les variables de base
  for (let j = 0; j < numProducts; j++) {
    let isBasic = false;
    let basicRow = -1;
    
    // Chercher une colonne avec un seul 1 et le reste 0
    let oneCount = 0;
    let oneRow = -1;
    
    for (let i = 0; i <= numResources; i++) {
      if (Math.abs(tableau[i][j] - 1) < 1e-10) {
        oneCount++;
        oneRow = i;
      } else if (Math.abs(tableau[i][j]) > 1e-10) {
        oneCount = -1;
        break;
      }
    }
    
    if (oneCount === 1 && oneRow > 0) {
      solution[j] = tableau[oneRow][numVariables];
      isBasic = true;
    }
  }
  
  const objectiveValue = -tableau[0][numVariables]; // Négatif car on avait inversé pour la maximisation
  
  console.log("Solution finale:", solution);
  console.log("Valeur objective:", objectiveValue);
  
  return {
    solution,
    objectiveValue,
    iterations,
    status: "optimal"
  };
}
