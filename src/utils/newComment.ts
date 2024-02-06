class newComment {
  content: string;
  review_id: string;
  user_id: string | null;

  constructor(reviewId: string, userId: string | null, content: string) {
    this.content = content;
    this.review_id = reviewId;
    this.user_id = userId;
  }
}

export default newComment;
