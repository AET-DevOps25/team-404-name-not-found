interface GithubLoginButtonProps {
    onClick: () => void;
}

const GitHubLoginButton = ({ onClick }: GithubLoginButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center justify-center gap-3 px-5 py-2.5 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
        >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.96.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2.01-3.2.7-3.88-1.54-3.88-1.54-.53-1.35-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.74 1.27 3.41.97.1-.75.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.71 0-1.26.45-2.3 1.18-3.11-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.18a10.92 10.92 0 012.86-.38c.97 0 1.94.13 2.86.38 2.18-1.49 3.14-1.18 3.14-1.18.62 1.57.23 2.73.11 3.02.74.81 1.18 1.85 1.18 3.11 0 4.45-2.71 5.41-5.29 5.69.42.36.8 1.08.8 2.18 0 1.58-.02 2.86-.02 3.25 0 .31.21.67.8.56C20.71 21.42 24 17.1 24 12 24 5.65 18.35.5 12 .5z" />
            </svg>
            <span className="font-semibold">Login with GitHub</span>
        </button>
    );
};

export default GitHubLoginButton;
