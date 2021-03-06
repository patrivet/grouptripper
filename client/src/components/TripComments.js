import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import InputComment from './InputComment';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
  useTripComments,
  useCreateComment,
  useDeleteComment,
} from '../hooks/comments';

dayjs.extend(relativeTime);

//eslint-disable-next-line
export default function TripComments({ tripId }) {
  const { user } = useAuth0();
  const { name, picture } = user;

  const { comments } = useTripComments(tripId);
  const [createComment] = useCreateComment();
  const [deleteComment] = useDeleteComment();

  //eslint-disable-next-line
  const handleCreateComment = async ({ comment }) => {
    const newComment = {
      username: name,
      picture,
      comment,
      tripId,
    };
    createComment({ comment: newComment });
  };

  //eslint-disable-next-line
  const handleDeleteComment = async (comment) => {
    deleteComment({ comment });
  };

  return (
    <div>
      <InputComment onSubmit={handleCreateComment} user={user} />
      {comments.map((comment, index) => {
        return (
          <div
            className="flex items-center justify-between p-4 my-4 bg-gray-100 rounded"
            key={index}
          >
            <img
              className="w-10 h-10 mr-4 rounded-full"
              src={comment.picture}
              alt="user"
            />
            <div className="flex-col items-start flex-grow space-y-3">
              <p className="space-x-3">
                <span className="font-semibold">{comment.username}</span>
                <span className="text-xs italic">
                  {comment.createdAt ? dayjs(comment.createdAt).fromNow() : ''}
                </span>
              </p>
              <p>{comment.comment}</p>
            </div>
            {comment.username === name && (
              <button
                className="mx-4 text-gray-400 hover:text-gray-800 focus:outline-none"
                style={{ transition: 'all .15s ease' }}
                onClick={() => handleDeleteComment(comment)} //eslint-disable-line
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
