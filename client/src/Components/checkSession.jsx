const checkAuth = async () => {
    try {
        const response = await fetch("/api/checksession", {
            credentials: "include", // Ensures cookies are sent
        });
        if (!response.ok) throw new Error("No session found");
        return await response.json();
    } catch {
        return null;
    }
};

export default checkAuth;
