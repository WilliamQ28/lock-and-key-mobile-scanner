
const express = require("express");
const cors = require("cors");
const { NodeSSH } = require("node-ssh");
const config = require("./config");

const app = express();
const ssh = new NodeSSH();

app.use(cors());
app.use(express.json());

// Basic route to check server status
app.get("/", (req, res) => {
  res.send("Metasploit Backend is Running!");
});

// Nmap Scan Route
app.get("/scan", async (req, res) => {
  const advanced = req.query.advanced === "true";
  const scanCommand = advanced
    ? config.nmapAdvancedCommand
    : config.nmapQuickCommand;

  console.log(`Running ${advanced ? "Advanced" : "Quick"} scan: ${scanCommand}`);

  try {
    await ssh.connect({
      host: config.kaliIP,
      username: config.sshUser,
      password: config.sshPassword,
    });

    const result = await ssh.execCommand(scanCommand);
    const rawOutput = result.stdout || result.stderr;

    if (!rawOutput || rawOutput.trim() === "") {
      throw new Error("Nmap scan did not produce any output.");
    }

    res.json({
      output: rawOutput,
      scanType: advanced ? "Advanced" : "Quick",
    });
  } catch (error) {
    console.error("Error running Nmap:", error);
    res.status(500).json({ error: "Failed to execute Nmap scan." });
  }
});

// Scan for Available Payloads by Comparing Service Name and Version
app.post("/scan-payloads", async (req, res) => {
  console.log("Received payload scan request:", req.body);
  const { serviceName, serviceVersion, targetIP } = req.body;

  if (!serviceName || !targetIP) {
    console.error("Invalid input. Service name and target IP are required.");
    return res.status(400).send({ error: "Service name and target IP are required" });
  }

  // Determine the longer string between serviceName and serviceVersion
  const searchTerm =
    serviceVersion && serviceVersion.trim().length > serviceName.trim().length
      ? serviceVersion.trim()
      : serviceName.trim();

  console.log(`Using search term: "${searchTerm}"`);

  const searchCommand = `msfconsole -q -x "search type:exploit name:${searchTerm}"`;
  console.log(`Searching for exploits: ${searchCommand}`);

  try {
    await ssh.connect({
      host: config.kaliIP,
      username: config.sshUser,
      password: config.sshPassword,
    });

    const result = await ssh.execCommand(searchCommand);
    console.log("Raw Metasploit Output:", result.stdout || result.stderr);

    if (!result.stdout || result.stdout.trim() === "") {
      console.error("No output received from Metasploit search.");
      return res.status(404).send({ error: "No matching exploits found." });
    }

    const exploits = parseMsfResults(result.stdout);
    console.log("Found Exploits:", exploits);

    res.json({ exploits });
  } catch (error) {
    console.error("SSH Error:", error);
    res.status(500).json({ error: "Failed to search Metasploit for exploits." });
  }
});

// Parse Metasploit Results and Return Top 10 Exploits
function parseMsfResults(output) {
  if (!output || typeof output !== "string") {
    console.error("parseMsfResults received invalid output:", output);
    return [];
  }

  const lines = output.split("\n").filter((line) => line.includes("exploit/"));

  if (lines.length === 0) {
    console.warn("No valid exploit results found.");
    return [];
  }

  const exploits = lines
    .map((line) => {
      const parts = line.split(/\s{2,}/); // Split by multiple spaces
      if (parts.length < 5 || !parts[1]) {
        return null;
      }
      return {
        name: parts[1]?.trim() || "Unknown Exploit",
        description: parts[4]?.trim() || "No description available",
      };
    })
    .filter(Boolean)
    .slice(0, 10); // Limit results to 10 exploits

  return exploits;
}

// Start the Backend on Port 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Metasploit Backend is running on port ${PORT}`));
