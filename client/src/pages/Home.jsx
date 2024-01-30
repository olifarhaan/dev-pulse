const Home = () => {
  return (
    <main>
      <section className="w-full min-h-screen flex justify-center items-center">
        <div className="w-auto flex flex-col gap-4 max-w-4xl justify-center text-center">
          <p className="">Welcome to the World of Tech Blogs</p>
          <h1 className="text-6xl">
            Revolutionize Your Tech Journey with Dev Pulse: Stay Informed, Stay
            Ahead
          </h1>
          <button className="bg-accentBlue text-white rounded-lg h-10 hover:bg-accentOrange transition duration-500 ease-in-out">
            View Blogs
          </button>
        </div>
      </section>
    </main>
  )
}

export default Home
