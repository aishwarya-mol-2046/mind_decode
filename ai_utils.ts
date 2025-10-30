// AI Utilities for Mock Test Generation
// Supports: Mock Generator (default), Gemini API (optional)

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

// Question templates by subject
const questionBanks: Record<string, Record<string, Question[]>> = {
  Mathematics: {
    Easy: [
      {
        question: "What is 15 + 27?",
        options: ["A. 32", "B. 42", "C. 52", "D. 62"],
        correct_answer: "B",
        explanation: "15 + 27 = 42. Add the ones place (5+7=12, carry 1) and tens place (1+2+1=4)."
      },
      {
        question: "What is the value of 8 × 7?",
        options: ["A. 54", "B. 56", "C. 58", "D. 64"],
        correct_answer: "B",
        explanation: "8 × 7 = 56. This is a basic multiplication fact."
      },
      {
        question: "What is 100 - 37?",
        options: ["A. 53", "B. 63", "C. 73", "D. 83"],
        correct_answer: "B",
        explanation: "100 - 37 = 63. Subtract the ones (10-7=3) and tens (9-3=6)."
      },
      {
        question: "What is 1/2 + 1/4?",
        options: ["A. 1/4", "B. 1/2", "C. 3/4", "D. 1"],
        correct_answer: "C",
        explanation: "1/2 + 1/4 = 2/4 + 1/4 = 3/4. Convert to common denominator and add."
      },
      {
        question: "What is the perimeter of a square with side length 5 cm?",
        options: ["A. 10 cm", "B. 15 cm", "C. 20 cm", "D. 25 cm"],
        correct_answer: "C",
        explanation: "Perimeter = 4 × side = 4 × 5 = 20 cm."
      }
    ],
    Medium: [
      {
        question: "Solve for x: 2x + 5 = 17",
        options: ["A. x = 4", "B. x = 6", "C. x = 8", "D. x = 10"],
        correct_answer: "B",
        explanation: "2x + 5 = 17 → 2x = 12 → x = 6"
      },
      {
        question: "What is the area of a triangle with base 8 cm and height 6 cm?",
        options: ["A. 14 cm²", "B. 24 cm²", "C. 28 cm²", "D. 48 cm²"],
        correct_answer: "B",
        explanation: "Area = (1/2) × base × height = (1/2) × 8 × 6 = 24 cm²"
      },
      {
        question: "Simplify: 3x² + 5x² - 2x²",
        options: ["A. 4x²", "B. 5x²", "C. 6x²", "D. 8x²"],
        correct_answer: "C",
        explanation: "Combine like terms: 3x² + 5x² - 2x² = 6x²"
      },
      {
        question: "What is 25% of 80?",
        options: ["A. 15", "B. 20", "C. 25", "D. 30"],
        correct_answer: "B",
        explanation: "25% of 80 = 0.25 × 80 = 20"
      },
      {
        question: "If f(x) = 2x + 3, what is f(5)?",
        options: ["A. 10", "B. 11", "C. 12", "D. 13"],
        correct_answer: "D",
        explanation: "f(5) = 2(5) + 3 = 10 + 3 = 13"
      }
    ],
    Hard: [
      {
        question: "What is the derivative of f(x) = x³ + 2x²?",
        options: ["A. 3x² + 2x", "B. 3x² + 4x", "C. x² + 4x", "D. 2x² + 4x"],
        correct_answer: "B",
        explanation: "Using power rule: d/dx(x³) = 3x², d/dx(2x²) = 4x. Result: 3x² + 4x"
      },
      {
        question: "Solve: ∫(3x² + 2x) dx",
        options: ["A. x³ + x² + C", "B. 3x³ + 2x² + C", "C. x³ + 2x² + C", "D. 3x + 2 + C"],
        correct_answer: "A",
        explanation: "∫3x² dx = x³, ∫2x dx = x². Result: x³ + x² + C"
      },
      {
        question: "What is the solution to the quadratic equation x² - 5x + 6 = 0?",
        options: ["A. x = 1, 6", "B. x = 2, 3", "C. x = -2, -3", "D. x = 1, 5"],
        correct_answer: "B",
        explanation: "Factor: (x-2)(x-3) = 0, so x = 2 or x = 3"
      },
      {
        question: "What is ln(e³)?",
        options: ["A. 1", "B. 2", "C. 3", "D. e"],
        correct_answer: "C",
        explanation: "ln(e³) = 3 × ln(e) = 3 × 1 = 3"
      },
      {
        question: "What is the limit as x approaches 0 of (sin x)/x?",
        options: ["A. 0", "B. 1", "C. ∞", "D. undefined"],
        correct_answer: "B",
        explanation: "This is a standard limit: lim(x→0) (sin x)/x = 1"
      }
    ]
  },
  Physics: {
    Easy: [
      {
        question: "What is the SI unit of force?",
        options: ["A. Joule", "B. Newton", "C. Watt", "D. Pascal"],
        correct_answer: "B",
        explanation: "The SI unit of force is the Newton (N), named after Isaac Newton."
      },
      {
        question: "What is the speed of light in vacuum?",
        options: ["A. 3 × 10⁸ m/s", "B. 3 × 10⁶ m/s", "C. 3 × 10⁴ m/s", "D. 3 × 10² m/s"],
        correct_answer: "A",
        explanation: "The speed of light in vacuum is approximately 3 × 10⁸ meters per second."
      },
      {
        question: "What type of energy does a moving car possess?",
        options: ["A. Potential", "B. Kinetic", "C. Thermal", "D. Nuclear"],
        correct_answer: "B",
        explanation: "A moving object possesses kinetic energy due to its motion."
      },
      {
        question: "What is the formula for kinetic energy?",
        options: ["A. KE = mv", "B. KE = 1/2 mv", "C. KE = 1/2 mv²", "D. KE = mv²"],
        correct_answer: "C",
        explanation: "Kinetic energy is given by KE = 1/2 mv², where m is mass and v is velocity."
      },
      {
        question: "What happens to the resistance if the length of a wire is doubled?",
        options: ["A. Halves", "B. Doubles", "C. Quadruples", "D. Remains same"],
        correct_answer: "B",
        explanation: "Resistance is directly proportional to length: R = ρL/A. Doubling L doubles R."
      }
    ],
    Medium: [
      {
        question: "A car accelerates from rest at 2 m/s². What is its velocity after 10 seconds?",
        options: ["A. 10 m/s", "B. 15 m/s", "C. 20 m/s", "D. 25 m/s"],
        correct_answer: "C",
        explanation: "v = u + at = 0 + 2(10) = 20 m/s"
      },
      {
        question: "What is the gravitational potential energy of a 5 kg mass at height 10 m? (g = 10 m/s²)",
        options: ["A. 250 J", "B. 500 J", "C. 750 J", "D. 1000 J"],
        correct_answer: "B",
        explanation: "PE = mgh = 5 × 10 × 10 = 500 J"
      },
      {
        question: "What is Ohm's Law?",
        options: ["A. V = I/R", "B. V = IR", "C. V = R/I", "D. I = VR"],
        correct_answer: "B",
        explanation: "Ohm's Law states that V = IR, where V is voltage, I is current, and R is resistance."
      },
      {
        question: "What is the frequency of a wave with wavelength 2 m and speed 10 m/s?",
        options: ["A. 2 Hz", "B. 5 Hz", "C. 10 Hz", "D. 20 Hz"],
        correct_answer: "B",
        explanation: "Frequency f = v/λ = 10/2 = 5 Hz"
      },
      {
        question: "What is the work done when a force of 20 N moves an object 5 m?",
        options: ["A. 4 J", "B. 25 J", "C. 100 J", "D. 15 J"],
        correct_answer: "C",
        explanation: "Work = Force × Distance = 20 × 5 = 100 J"
      }
    ],
    Hard: [
      {
        question: "A projectile is launched at 45° with initial velocity 20 m/s. What is its maximum height? (g = 10 m/s²)",
        options: ["A. 5 m", "B. 10 m", "C. 15 m", "D. 20 m"],
        correct_answer: "B",
        explanation: "h_max = (v²sin²θ)/(2g) = (400 × 0.5)/(20) = 10 m"
      },
      {
        question: "What is the escape velocity from Earth's surface? (approximately)",
        options: ["A. 7.9 km/s", "B. 9.8 km/s", "C. 11.2 km/s", "D. 15.0 km/s"],
        correct_answer: "C",
        explanation: "Escape velocity from Earth is approximately 11.2 km/s."
      },
      {
        question: "In a parallel circuit with two resistors (3Ω and 6Ω), what is the equivalent resistance?",
        options: ["A. 1Ω", "B. 2Ω", "C. 4.5Ω", "D. 9Ω"],
        correct_answer: "B",
        explanation: "1/R = 1/3 + 1/6 = 3/6 = 1/2, so R = 2Ω"
      },
      {
        question: "What is the de Broglie wavelength concept related to?",
        options: ["A. Wave nature of light", "B. Particle nature of matter", "C. Wave-particle duality", "D. Electromagnetic waves"],
        correct_answer: "C",
        explanation: "De Broglie wavelength demonstrates the wave-particle duality of matter."
      },
      {
        question: "What is the time period of a simple pendulum with length 1 m? (g = 10 m/s²)",
        options: ["A. π/5 s", "B. 2π/5 s", "C. π s", "D. 2π s"],
        correct_answer: "D",
        explanation: "T = 2π√(L/g) = 2π√(1/10) ≈ 2π s (approximately)"
      }
    ]
  },
  "Computer Science": {
    Easy: [
      {
        question: "What does CPU stand for?",
        options: ["A. Central Process Unit", "B. Central Processing Unit", "C. Computer Personal Unit", "D. Central Processor Unit"],
        correct_answer: "B",
        explanation: "CPU stands for Central Processing Unit, the main processor of a computer."
      },
      {
        question: "Which of these is a programming language?",
        options: ["A. HTML", "B. CSS", "C. Python", "D. HTTP"],
        correct_answer: "C",
        explanation: "Python is a programming language. HTML and CSS are markup languages, HTTP is a protocol."
      },
      {
        question: "What is the binary representation of decimal 5?",
        options: ["A. 100", "B. 101", "C. 110", "D. 111"],
        correct_answer: "B",
        explanation: "5 in binary is 101 (1×4 + 0×2 + 1×1 = 5)"
      },
      {
        question: "What does RAM stand for?",
        options: ["A. Random Access Memory", "B. Read Access Memory", "C. Rapid Access Memory", "D. Remote Access Memory"],
        correct_answer: "A",
        explanation: "RAM stands for Random Access Memory, used for temporary data storage."
      },
      {
        question: "Which data structure uses LIFO (Last In First Out)?",
        options: ["A. Queue", "B. Stack", "C. Array", "D. Tree"],
        correct_answer: "B",
        explanation: "A Stack follows the LIFO principle - last item added is first to be removed."
      }
    ],
    Medium: [
      {
        question: "What is the time complexity of binary search?",
        options: ["A. O(1)", "B. O(n)", "C. O(log n)", "D. O(n²)"],
        correct_answer: "C",
        explanation: "Binary search has O(log n) time complexity as it halves the search space each iteration."
      },
      {
        question: "In object-oriented programming, what is encapsulation?",
        options: ["A. Hiding data", "B. Inheriting properties", "C. Multiple forms", "D. Runtime binding"],
        correct_answer: "A",
        explanation: "Encapsulation is the bundling and hiding of data, restricting direct access to object internals."
      },
      {
        question: "What is the output of: print(2 ** 3) in Python?",
        options: ["A. 5", "B. 6", "C. 8", "D. 9"],
        correct_answer: "C",
        explanation: "The ** operator is exponentiation in Python. 2³ = 8"
      },
      {
        question: "Which sorting algorithm has the best average-case time complexity?",
        options: ["A. Bubble Sort", "B. Selection Sort", "C. Merge Sort", "D. Insertion Sort"],
        correct_answer: "C",
        explanation: "Merge Sort has O(n log n) average-case complexity, better than O(n²) algorithms."
      },
      {
        question: "What does SQL stand for?",
        options: ["A. Structured Query Language", "B. Simple Query Language", "C. Standard Query Language", "D. System Query Language"],
        correct_answer: "A",
        explanation: "SQL stands for Structured Query Language, used for database operations."
      }
    ],
    Hard: [
      {
        question: "What is the space complexity of QuickSort in the worst case?",
        options: ["A. O(1)", "B. O(log n)", "C. O(n)", "D. O(n²)"],
        correct_answer: "C",
        explanation: "In worst case, QuickSort's recursion depth is O(n), requiring O(n) space on the call stack."
      },
      {
        question: "Which design pattern ensures a class has only one instance?",
        options: ["A. Factory", "B. Singleton", "C. Observer", "D. Strategy"],
        correct_answer: "B",
        explanation: "The Singleton pattern restricts instantiation to a single object."
      },
      {
        question: "What is the purpose of a hash function in hash tables?",
        options: ["A. Sort data", "B. Map keys to indices", "C. Encrypt data", "D. Compress data"],
        correct_answer: "B",
        explanation: "Hash functions map keys to array indices for efficient lookup in hash tables."
      },
      {
        question: "In database normalization, what does 3NF eliminate?",
        options: ["A. Partial dependencies", "B. Transitive dependencies", "C. Multi-valued dependencies", "D. Join dependencies"],
        correct_answer: "B",
        explanation: "Third Normal Form (3NF) eliminates transitive dependencies between non-key attributes."
      },
      {
        question: "What is the halting problem in computer science?",
        options: ["A. Finding infinite loops", "B. Determining if a program terminates", "C. Optimizing code execution", "D. Debugging runtime errors"],
        correct_answer: "B",
        explanation: "The halting problem is determining whether a program will finish running or continue forever."
      }
    ]
  },
  Chemistry: {
    Easy: [
      {
        question: "What is the chemical symbol for water?",
        options: ["A. H2O", "B. CO2", "C. O2", "D. H2O2"],
        correct_answer: "A",
        explanation: "Water is H2O - two hydrogen atoms bonded to one oxygen atom."
      },
      {
        question: "What is the atomic number of carbon?",
        options: ["A. 4", "B. 6", "C. 8", "D. 12"],
        correct_answer: "B",
        explanation: "Carbon has atomic number 6, meaning it has 6 protons in its nucleus."
      },
      {
        question: "What type of bond forms between metals and non-metals?",
        options: ["A. Covalent", "B. Ionic", "C. Metallic", "D. Hydrogen"],
        correct_answer: "B",
        explanation: "Ionic bonds form between metals (which lose electrons) and non-metals (which gain electrons)."
      },
      {
        question: "What is the pH of a neutral solution?",
        options: ["A. 0", "B. 5", "C. 7", "D. 14"],
        correct_answer: "C",
        explanation: "A neutral solution has pH 7. Below 7 is acidic, above 7 is basic."
      },
      {
        question: "What gas do plants absorb during photosynthesis?",
        options: ["A. Oxygen", "B. Nitrogen", "C. Carbon dioxide", "D. Hydrogen"],
        correct_answer: "C",
        explanation: "Plants absorb carbon dioxide (CO2) and release oxygen during photosynthesis."
      }
    ],
    Medium: [
      {
        question: "What is Avogadro's number?",
        options: ["A. 6.022 × 10²³", "B. 3.14 × 10⁸", "C. 9.8 × 10⁹", "D. 1.6 × 10⁻¹⁹"],
        correct_answer: "A",
        explanation: "Avogadro's number is 6.022 × 10²³, the number of particles in one mole."
      },
      {
        question: "What is the molecular formula of glucose?",
        options: ["A. C6H12O6", "B. C12H22O11", "C. C2H5OH", "D. CH4"],
        correct_answer: "A",
        explanation: "Glucose has the molecular formula C6H12O6."
      },
      {
        question: "Which element has the highest electronegativity?",
        options: ["A. Oxygen", "B. Fluorine", "C. Chlorine", "D. Nitrogen"],
        correct_answer: "B",
        explanation: "Fluorine is the most electronegative element on the periodic table."
      },
      {
        question: "What type of reaction is: 2H2 + O2 → 2H2O?",
        options: ["A. Decomposition", "B. Single displacement", "C. Synthesis", "D. Double displacement"],
        correct_answer: "C",
        explanation: "This is a synthesis reaction where two elements combine to form a compound."
      },
      {
        question: "What is the oxidation state of oxygen in H2O?",
        options: ["A. -2", "B. -1", "C. +1", "D. +2"],
        correct_answer: "A",
        explanation: "Oxygen typically has an oxidation state of -2 in most compounds."
      }
    ],
    Hard: [
      {
        question: "What is the hybridization of carbon in methane (CH4)?",
        options: ["A. sp", "B. sp²", "C. sp³", "D. sp³d"],
        correct_answer: "C",
        explanation: "Carbon in methane is sp³ hybridized, forming 4 equivalent bonds in a tetrahedral geometry."
      },
      {
        question: "What is the Gibbs free energy equation?",
        options: ["A. ΔG = ΔH + TΔS", "B. ΔG = ΔH - TΔS", "C. ΔG = TΔS - ΔH", "D. ΔG = ΔH × TΔS"],
        correct_answer: "B",
        explanation: "Gibbs free energy: ΔG = ΔH - TΔS, where H is enthalpy, T is temperature, S is entropy."
      },
      {
        question: "Which quantum number determines the shape of an orbital?",
        options: ["A. Principal (n)", "B. Azimuthal (l)", "C. Magnetic (m)", "D. Spin (s)"],
        correct_answer: "B",
        explanation: "The azimuthal quantum number (l) determines the shape of the orbital (s, p, d, f)."
      },
      {
        question: "What is the rate law for a first-order reaction?",
        options: ["A. rate = k", "B. rate = k[A]", "C. rate = k[A]²", "D. rate = k[A][B]"],
        correct_answer: "B",
        explanation: "For a first-order reaction, the rate is directly proportional to concentration: rate = k[A]"
      },
      {
        question: "What principle states that electrons fill orbitals from lowest to highest energy?",
        options: ["A. Pauli Exclusion", "B. Hund's Rule", "C. Aufbau Principle", "D. Heisenberg Uncertainty"],
        correct_answer: "C",
        explanation: "The Aufbau Principle states electrons fill orbitals in order of increasing energy."
      }
    ]
  },
  Biology: {
    Easy: [
      {
        question: "What is the powerhouse of the cell?",
        options: ["A. Nucleus", "B. Mitochondria", "C. Ribosome", "D. Chloroplast"],
        correct_answer: "B",
        explanation: "Mitochondria are called the powerhouse because they produce ATP through cellular respiration."
      },
      {
        question: "Which molecule carries genetic information?",
        options: ["A. RNA", "B. Protein", "C. DNA", "D. Lipid"],
        correct_answer: "C",
        explanation: "DNA (Deoxyribonucleic Acid) carries genetic information in all living organisms."
      },
      {
        question: "What is the process by which plants make food?",
        options: ["A. Respiration", "B. Photosynthesis", "C. Digestion", "D. Fermentation"],
        correct_answer: "B",
        explanation: "Photosynthesis is the process where plants use sunlight to convert CO2 and water into glucose."
      },
      {
        question: "How many chambers does a human heart have?",
        options: ["A. 2", "B. 3", "C. 4", "D. 5"],
        correct_answer: "C",
        explanation: "The human heart has 4 chambers: left atrium, right atrium, left ventricle, right ventricle."
      },
      {
        question: "What is the basic unit of life?",
        options: ["A. Atom", "B. Molecule", "C. Cell", "D. Organ"],
        correct_answer: "C",
        explanation: "The cell is the smallest unit of life that can function independently."
      }
    ],
    Medium: [
      {
        question: "What is the function of ribosomes?",
        options: ["A. Energy production", "B. Protein synthesis", "C. DNA replication", "D. Lipid storage"],
        correct_answer: "B",
        explanation: "Ribosomes are responsible for protein synthesis by translating mRNA."
      },
      {
        question: "What phase of mitosis do chromosomes align at the cell's equator?",
        options: ["A. Prophase", "B. Metaphase", "C. Anaphase", "D. Telophase"],
        correct_answer: "B",
        explanation: "During metaphase, chromosomes align at the metaphase plate (cell equator)."
      },
      {
        question: "What type of blood cells fight infection?",
        options: ["A. Red blood cells", "B. White blood cells", "C. Platelets", "D. Plasma cells"],
        correct_answer: "B",
        explanation: "White blood cells (leukocytes) are part of the immune system and fight infections."
      },
      {
        question: "What is the complementary base pair to adenine in DNA?",
        options: ["A. Cytosine", "B. Guanine", "C. Thymine", "D. Uracil"],
        correct_answer: "C",
        explanation: "In DNA, adenine pairs with thymine (A-T) through hydrogen bonds."
      },
      {
        question: "Which organelle modifies and packages proteins?",
        options: ["A. Endoplasmic reticulum", "B. Golgi apparatus", "C. Lysosome", "D. Peroxisome"],
        correct_answer: "B",
        explanation: "The Golgi apparatus modifies, packages, and sorts proteins for secretion or use."
      }
    ],
    Hard: [
      {
        question: "What is the Krebs cycle also known as?",
        options: ["A. Calvin cycle", "B. Citric acid cycle", "C. Electron transport chain", "D. Glycolysis"],
        correct_answer: "B",
        explanation: "The Krebs cycle is also called the citric acid cycle or TCA cycle."
      },
      {
        question: "How many ATP molecules are produced per glucose in aerobic respiration?",
        options: ["A. 2", "B. 4", "C. 36-38", "D. 100"],
        correct_answer: "C",
        explanation: "Aerobic respiration produces approximately 36-38 ATP molecules per glucose molecule."
      },
      {
        question: "What is the role of tRNA in protein synthesis?",
        options: ["A. Carries genetic code", "B. Brings amino acids", "C. Forms ribosomes", "D. Catalyzes reactions"],
        correct_answer: "B",
        explanation: "Transfer RNA (tRNA) carries specific amino acids to the ribosome during translation."
      },
      {
        question: "Which enzyme unwinds the DNA double helix during replication?",
        options: ["A. DNA polymerase", "B. RNA primase", "C. DNA helicase", "D. DNA ligase"],
        correct_answer: "C",
        explanation: "DNA helicase unwinds and separates the DNA double helix for replication."
      },
      {
        question: "What is crossing over in genetics?",
        options: ["A. Chromosome duplication", "B. Gene mutation", "C. Exchange of genetic material", "D. Cell division"],
        correct_answer: "C",
        explanation: "Crossing over is the exchange of genetic material between homologous chromosomes during meiosis."
      }
    ]
  }
};

// Mock question generator (no API required)
function generateMockQuestions(subject: string, difficulty: string): Question[] {
  const normalizedSubject = subject.trim();
  const normalizedDifficulty = difficulty || "Medium";
  
  // Try to find exact match
  let questions = questionBanks[normalizedSubject]?.[normalizedDifficulty];
  
  // If not found, try case-insensitive match
  if (!questions) {
    const subjectKey = Object.keys(questionBanks).find(
      key => key.toLowerCase() === normalizedSubject.toLowerCase()
    );
    if (subjectKey) {
      questions = questionBanks[subjectKey]?.[normalizedDifficulty];
    }
  }
  
  // If still not found, use Mathematics Easy as fallback
  if (!questions || questions.length === 0) {
    console.log(`No questions found for ${subject} (${difficulty}), using fallback`);
    questions = questionBanks.Mathematics.Easy;
  }
  
  return questions;
}

// Optional: Google Gemini API integration
async function generateQuestionsWithGemini(subject: string, difficulty: string): Promise<Question[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const prompt = `Generate 5 multiple-choice exam questions about ${subject} at ${difficulty} difficulty level. 
  
  Format each question as JSON with:
  - question: the question text
  - options: array of 4 options labeled A, B, C, D
  - correct_answer: the letter of the correct option (A, B, C, or D)
  - explanation: brief explanation of the correct answer
  
  Return ONLY a JSON object with a "questions" array containing these 5 questions.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error("No response from Gemini");
    }

    // Try to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.questions || [];
    }
    
    throw new Error("Could not parse Gemini response");
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

// Main function: tries Gemini first, falls back to mock
export async function generateQuestions(subject: string, difficulty: string = "Medium"): Promise<Question[]> {
  // If Gemini API key is available, try using it first
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log(`Attempting to generate questions with Gemini API for ${subject} (${difficulty})`);
      return await generateQuestionsWithGemini(subject, difficulty);
    } catch (error) {
      console.log("Gemini API failed, falling back to mock generator");
    }
  }
  
  // Fall back to mock generator
  console.log(`Generating mock questions for ${subject} (${difficulty})`);
  return generateMockQuestions(subject, difficulty);
}

// Get list of available subjects
export function getAvailableSubjects(): string[] {
  return Object.keys(questionBanks);
}
