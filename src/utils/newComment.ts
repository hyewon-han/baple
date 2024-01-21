class newComment {
  content: string;
  review_id: string;
  user_id: string;

  constructor(reviewId: string, userId: string, content: string) {
    // this.id = nanoid();
    this.content = content;
    this.review_id = reviewId;
    this.user_id = userId;
  }
}

export default newComment;
