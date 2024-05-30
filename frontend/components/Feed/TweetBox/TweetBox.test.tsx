import { render, screen } from "@testing-library/react";
import TweetBox from "./TweetBox";

test("Tweet Box Testing ", () => {
  render(<TweetBox />);
  //   render(<TweetBox />);
  //   const tweet_btn = screen.getByText("Tweet");
  //   expect(tweet_btn).toBeInTheDocument();
});
